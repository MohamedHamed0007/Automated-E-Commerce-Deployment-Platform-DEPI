import axiosInstance from "@/lib/axiosInstance";
import { buildInternalApiUrl } from "@/lib/internalApiUrl";
import type {
  ChatMessage,
  ChatMessagesResult,
  ChatSummary,
} from "@/types/Chat";

type UnknownRecord = Record<string, unknown>;

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
};

export type CreateChatPayload = {
  userId?: string;
  participantName?: string;
  participantEmail?: string;
  name?: string;
  email?: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object";
}

function unwrapPayload<T>(payload: T | ApiEnvelope<T>): T {
  if (isRecord(payload) && "data" in payload && payload.data !== undefined) {
    return payload.data as T;
  }

  return payload as T;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asOptionalString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return false;
}

function getChatId(value: UnknownRecord) {
  return (
    asString(value._id) ||
    asString(value.id) ||
    asString(value.chatId) ||
    asString(value.chat?._id)
  );
}

function getMessageId(value: UnknownRecord) {
  return (
    asString(value._id) ||
    asString(value.id) ||
    `${asString(value.chatId, "chat")}-${asString(value.createdAt, Date.now().toString())}`
  );
}

function normalizeChatSummary(rawChat: unknown): ChatSummary {
  const chat = isRecord(rawChat) ? rawChat : {};
  const participant = isRecord(chat.user)
    ? chat.user
    : isRecord(chat.customer)
      ? chat.customer
      : isRecord(chat.participant)
        ? chat.participant
        : isRecord(chat.client)
          ? chat.client
          : null;

  const lastMessageRecord = isRecord(chat.lastMessage)
    ? chat.lastMessage
    : isRecord(chat.latestMessage)
      ? chat.latestMessage
      : null;

  const status = asString(chat.status, asBoolean(chat.closed) ? "closed" : "open");

  return {
    _id: getChatId(chat),
    participantName:
      (participant && (asString(participant.fullName) || asString(participant.name))) ||
      asString(chat.participantName) ||
      asString(chat.customerName) ||
      asString(chat.name) ||
      "Unknown customer",
    participantEmail:
      (participant && asOptionalString(participant.email)) ||
      asOptionalString(chat.participantEmail) ||
      asOptionalString(chat.email),
    avatar:
      (participant && asOptionalString(participant.avatar)) ||
      asOptionalString(chat.avatar),
    lastMessage:
      asString(chat.lastMessagePreview) ||
      (lastMessageRecord && (asString(lastMessageRecord.message) || asString(lastMessageRecord.text))) ||
      asString(chat.lastMessage) ||
      "No messages yet",
    unreadCount:
      asNumber(chat.unreadCount) ||
      asNumber(chat.unreadMessagesCount) ||
      asNumber(chat.unread),
    updatedAt:
      asOptionalString(chat.updatedAt) ||
      (lastMessageRecord && asOptionalString(lastMessageRecord.createdAt)),
    createdAt: asOptionalString(chat.createdAt),
    isClosed: status.toLowerCase() === "closed" || asBoolean(chat.isClosed) || asBoolean(chat.closed),
    status,
  };
}

function normalizeMessage(rawMessage: unknown): ChatMessage {
  const message = isRecord(rawMessage) ? rawMessage : {};
  const senderValue = asString(message.sender).toLowerCase();
  const sender: ChatMessage["sender"] =
    senderValue === "admin" || senderValue === "user" || senderValue === "bot" || senderValue === "system"
      ? (senderValue as ChatMessage["sender"])
      : asBoolean(message.isAdmin)
        ? "admin"
        : "user";

  const chatId =
    asString(message.chatId) ||
    (isRecord(message.chat) ? asString(message.chat._id) || asString(message.chat.id) : "");

  return {
    _id: getMessageId(message),
    chatId,
    sender,
    text: asString(message.message) || asString(message.text),
    createdAt: asOptionalString(message.createdAt) || asOptionalString(message.timestamp),
    pending: asBoolean(message.pending),
  };
}

function extractChats(payload: unknown) {
  const unwrapped = unwrapPayload(payload);

  if (Array.isArray(unwrapped)) {
    return unwrapped.map(normalizeChatSummary);
  }

  if (isRecord(unwrapped)) {
    const candidates = [unwrapped.chats, unwrapped.items, unwrapped.results];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate.map(normalizeChatSummary);
      }
    }
  }

  return [];
}

function extractMessages(payload: unknown, page: number, limit: number): ChatMessagesResult {
  const unwrapped = unwrapPayload(payload);

  if (Array.isArray(unwrapped)) {
    return {
      messages: unwrapped.map(normalizeMessage),
      total: unwrapped.length,
      page,
      limit,
    };
  }

  if (isRecord(unwrapped)) {
    const candidates = [unwrapped.messages, unwrapped.docs, unwrapped.items, unwrapped.results];
    const found = candidates.find(Array.isArray);

    if (Array.isArray(found)) {
      return {
        messages: found.map(normalizeMessage),
        total:
          asNumber(unwrapped.total) ||
          asNumber(unwrapped.totalDocs) ||
          asNumber(unwrapped.count) ||
          found.length,
        page: asNumber(unwrapped.page, page),
        limit: asNumber(unwrapped.limit, limit),
      };
    }
  }

  return {
    messages: [],
    total: 0,
    page,
    limit,
  };
}

const CHAT_API_BASE = buildInternalApiUrl("/chatApi");

export async function getChats() {
  const response = await axiosInstance.get(`${CHAT_API_BASE}/all`);
  return extractChats(response.data);
}

export async function getChatMessages(chatId: string, page = 1, limit = 20) {
  const response = await axiosInstance.get(`${CHAT_API_BASE}/${chatId}/messages`, {
    params: { page, limit },
  });

  return extractMessages(response.data, page, limit);
}

export async function sendChatMessage(chatId: string, message: string) {
  const response = await axiosInstance.post(`${CHAT_API_BASE}/messages`, {
    chatId,
    message,
  });

  const payload = unwrapPayload(response.data);
  return isRecord(payload) ? normalizeMessage(payload) : null;
}

export async function markChatAsRead(chatId: string) {
  await axiosInstance.patch(`${CHAT_API_BASE}/${chatId}/read`);
  return chatId;
}

export async function closeChat(chatId: string) {
  await axiosInstance.patch(`${CHAT_API_BASE}/${chatId}/close`);
  return chatId;
}

export async function createChat(payload: CreateChatPayload) {
  const response = await axiosInstance.post(CHAT_API_BASE, payload);
  const createdChat = unwrapPayload(response.data);
  return normalizeChatSummary(createdChat);
}
