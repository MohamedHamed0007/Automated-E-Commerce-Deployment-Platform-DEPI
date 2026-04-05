import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * In Vite dev, connect via the page origin so `/socket.io` is proxied to the backend.
 * Otherwise derive origin from VITE_API_BASE_URL or fall back to backend port.
 */
function resolveSocketUrl(): string {
  const fromEnv = import.meta.env.VITE_SOCKET_URL;
  if (fromEnv) return fromEnv;

  if (import.meta.env.DEV) {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return "http://localhost:5173";
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  const api = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000/api/v1";
  try {
    return new URL(api).origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

const SOCKET_URL = resolveSocketUrl();

export const connectSocket = (token?: string, chatId?: string, guestId?: string): Socket => {
  const authPayload: Record<string, string> = {
    ...(token ? { token } : {}),
    ...(chatId ? { chatId } : {}),
    ...(guestId ? { guestId } : {}),
  };

  if (socket) {
    socket.auth = authPayload;
    if (!socket.connected) socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: authPayload,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const getSocket = () => socket;