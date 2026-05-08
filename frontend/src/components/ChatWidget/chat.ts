/**
 * In Vite dev, default to same-origin `/api/v1` so requests go through the dev proxy
 * (see vite.config.ts). Set `VITE_API_BASE_URL` to override (e.g. production).
 */
function resolveApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "/api/v1";
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api/v1`;
  }
  return "http://127.0.0.1:3000/api/v1";
}

const BASE_URL = resolveApiBaseUrl();

const GUEST_ID_KEY = "guestId";
const CHAT_ID_KEY = "chatId";

type ApiEnvelope = { success?: boolean; message?: string; data?: unknown };

async function readApiJson(res: Response, context: string): Promise<ApiEnvelope> {
  const text = await res.text();
  const trimmed = text.trim();

  if (!trimmed) {
    const proxyHint =
      import.meta.env.DEV && BASE_URL.startsWith("/")
        ? " Proxy returned an empty body — is the backend running on VITE_DEV_PROXY_TARGET (default http://127.0.0.1:3000)? Restart Vite after changing .env."
        : "";
    throw new Error(
      `${context}: empty response (HTTP ${res.status} ${res.statusText}).${proxyHint}`
    );
  }

  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    throw new Error(
      `${context}: expected JSON (HTTP ${res.status}), got: ${trimmed.slice(0, 160)}${trimmed.length > 160 ? "…" : ""}`
    );
  }

  try {
    return JSON.parse(trimmed) as ApiEnvelope;
  } catch (e) {
    throw new Error(`${context}: invalid JSON (HTTP ${res.status})`, { cause: e });
  }
}

function devProxyHint(): string {
  if (import.meta.env.DEV && BASE_URL.startsWith("/")) {
    return " Is the backend running? Set frontend/.env: VITE_DEV_PROXY_TARGET=http://127.0.0.1:<backend_port> (then restart `npm run dev`).";
  }
  return `Check VITE_API_BASE_URL (currently ${BASE_URL}).`;
}

const generateObjectId = (): string => {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
};

export const ensureGuestId = (): string => {
  const cachedGuestId = localStorage.getItem(GUEST_ID_KEY);
  if (cachedGuestId && /^[a-f0-9]{24}$/.test(cachedGuestId)) {
    return cachedGuestId;
  }

  const guestId = generateObjectId();
  localStorage.setItem(GUEST_ID_KEY, guestId);
  return guestId;
};

const getAuthHeaders = (token?: string, guestId?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (guestId) {
    headers["X-Guest-Id"] = guestId;
  }

  return headers;
};

const resolveAuth = (token?: string, guestId?: string): { token?: string; guestId: string } => {
  const cachedToken = token ?? localStorage.getItem("token") ?? undefined;
  const effectiveGuestId = guestId ?? ensureGuestId();
  return { token: cachedToken, guestId: effectiveGuestId };
};

export const getOrCreateChat = async (token?: string, guestId?: string): Promise<string> => {
  const { token: authToken, guestId: authGuestId } = resolveAuth(token, guestId);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/chatApi`, {
      method: "POST",
      headers: getAuthHeaders(authToken, authGuestId),
      body: JSON.stringify({}),
    });
  } catch (e) {
    console.error("[chat] getOrCreateChat network error", { BASE_URL, error: e });
    throw new Error(`Failed to open chat (network).${devProxyHint()}`, { cause: e });
  }

  const data = await readApiJson(res, "POST /chatApi");
  console.log("💬 Chat response:", data);

  if (!res.ok) {
    throw new Error(data.message || `Failed to open chat (HTTP ${res.status}).`);
  }

  const id = data.data && typeof data.data === "object" && data.data !== null && "_id" in data.data
    ? String((data.data as { _id: unknown })._id)
    : null;

  if (!id) {
    throw new Error(`Failed to get chatId: ${JSON.stringify(data)}`);
  }

  return id;
};

export const validateChatId = async (chatId: string, token?: string, guestId?: string): Promise<boolean> => {
  if (!chatId || typeof chatId !== "string") {
    return false;
  }

  const { token: authToken, guestId: authGuestId } = resolveAuth(token, guestId);
  const url = `${BASE_URL}/chatApi/${encodeURIComponent(chatId)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(authToken, authGuestId),
    });
  } catch (e) {
    console.error("[chat] validateChatId network error", { url, error: e });
    throw new Error(`Failed to validate chat (network).${devProxyHint()}`, { cause: e });
  }

  if (res.ok) {
    return true;
  }

  const data = await readApiJson(res, "GET /chatApi/:chatId");

  if (res.status === 403 || res.status === 404) {
    return false;
  }

  throw new Error(data.message || `Failed to validate chat (HTTP ${res.status}).`);
};

export const ensureValidChatId = async (token?: string, guestId?: string): Promise<string> => {
  const { token: authToken, guestId: authGuestId } = resolveAuth(token, guestId);
  const cachedChatId = localStorage.getItem(CHAT_ID_KEY);

  if (cachedChatId) {
    try {
      console.log("[chat] validating cached chatId", cachedChatId);
      const isValid = await validateChatId(cachedChatId, authToken, authGuestId);
      if (isValid) {
        return cachedChatId;
      }
      console.warn("[chat] cached chatId is invalid or expired", cachedChatId);
      localStorage.removeItem(CHAT_ID_KEY);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const isParticipantError = /Forbidden: you are not a participant of this chat|Chat not found|Failed to validate chat/.test(message);
      if (isParticipantError) {
        console.warn("[chat] cached chatId validation failed, clearing stale chatId", {
          chatId: cachedChatId,
          error: message,
        });
        localStorage.removeItem(CHAT_ID_KEY);
      } else {
        throw err;
      }
    }
  }

  const chatId = await getOrCreateChat(authToken, authGuestId);
  localStorage.setItem(CHAT_ID_KEY, chatId);
  return chatId;
};

export const fetchChatMessages = async (
  chatId: string,
  token?: string,
  guestId?: string,
  page = 1,
  limit = 50
): Promise<unknown[]> => {
  const { token: authToken, guestId: authGuestId } = resolveAuth(token, guestId);
  const url = `${BASE_URL}/chatApi/messages?chatId=${encodeURIComponent(chatId)}&page=${page}&limit=${limit}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(authToken, authGuestId),
    });
  } catch (e) {
    console.error("[chat] fetchChatMessages network error", { BASE_URL, url, error: e });
    throw new Error(`Failed to load chat history (network).${devProxyHint()}`, { cause: e });
  }

  const data = await readApiJson(res, "GET /chatApi/messages");

  if (!res.ok) {
    throw new Error(data.message || `Failed to load messages (HTTP ${res.status}).`);
  }

  if (data.data == null) return [];
  return Array.isArray(data.data) ? data.data : [];
};