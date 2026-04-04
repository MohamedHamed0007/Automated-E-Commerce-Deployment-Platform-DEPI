import { ObjectId, type Document } from "mongodb";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";

const CHAT_COLLECTION_CANDIDATES = [
  "chats",
  "chatThreads",
  "chatthreads",
  "chatRooms",
  "chatrooms",
  "conversations",
];

const MESSAGE_COLLECTION_CANDIDATES = [
  "messages",
  "chatMessages",
  "chatmessages",
  "chat_messages",
];

type MongoDocument = Document & Record<string, unknown>;

type ChatListItem = {
  _id: string;
  participantName: string;
  participantEmail: string | null;
  avatar: string | null;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string | null;
  createdAt: string | null;
  isClosed: boolean;
  status: string;
};

type ChatMessageItem = {
  _id: string;
  chatId: string;
  sender: "user" | "admin" | "bot" | "system";
  text: string;
  createdAt: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof ObjectId) {
    return value.toString();
  }

  return fallback;
}

function asOptionalString(value: unknown) {
  const result = asString(value);
  return result || null;
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

function toIsoString(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
}

function resolveSender(value: Record<string, unknown>) {
  const sender = asString(value.sender).toLowerCase();

  if (sender === "admin" || sender === "user" || sender === "bot" || sender === "system") {
    return sender as ChatMessageItem["sender"];
  }

  return asBoolean(value.isAdmin) ? "admin" : "user";
}

function getNestedRecord(value: Record<string, unknown>, key: string) {
  return asRecord(value[key]);
}

function getChatId(value: Record<string, unknown>) {
  return (
    asString(value._id) ||
    asString(value.id) ||
    asString(value.chatId) ||
    asString(getNestedRecord(value, "chat")?._id) ||
    asString(getNestedRecord(value, "chat")?.id)
  );
}

function getParticipant(value: Record<string, unknown>) {
  return (
    getNestedRecord(value, "user") ||
    getNestedRecord(value, "customer") ||
    getNestedRecord(value, "participant") ||
    getNestedRecord(value, "client")
  );
}

function normalizeChatMessage(
  rawMessage: Record<string, unknown>,
  fallbackChatId = ""
): ChatMessageItem {
  const chatRecord = getNestedRecord(rawMessage, "chat");

  return {
    _id:
      asString(rawMessage._id) ||
      asString(rawMessage.id) ||
      `${fallbackChatId || asString(rawMessage.chatId, "chat")}-${Date.now()}`,
    chatId:
      asString(rawMessage.chatId) ||
      asString(chatRecord?._id) ||
      asString(chatRecord?.id) ||
      fallbackChatId,
    sender: resolveSender(rawMessage),
    text: asString(rawMessage.message) || asString(rawMessage.text),
    createdAt: toIsoString(rawMessage.createdAt) || toIsoString(rawMessage.timestamp),
  };
}

function normalizeChat(rawChat: Record<string, unknown>, lastMessage?: ChatMessageItem): ChatListItem {
  const participant = getParticipant(rawChat);
  const latestMessageRecord =
    getNestedRecord(rawChat, "lastMessage") || getNestedRecord(rawChat, "latestMessage");

  const status = asString(rawChat.status, asBoolean(rawChat.closed) ? "closed" : "open");

  return {
    _id: getChatId(rawChat),
    participantName:
      (participant && (asString(participant.fullName) || asString(participant.name))) ||
      asString(rawChat.participantName) ||
      asString(rawChat.customerName) ||
      asString(rawChat.name) ||
      "Unknown customer",
    participantEmail:
      (participant && asOptionalString(participant.email)) ||
      asOptionalString(rawChat.participantEmail) ||
      asOptionalString(rawChat.email),
    avatar:
      (participant && asOptionalString(participant.avatar)) ||
      asOptionalString(rawChat.avatar),
    lastMessage:
      lastMessage?.text ||
      asString(rawChat.lastMessagePreview) ||
      (latestMessageRecord &&
        (asString(latestMessageRecord.message) || asString(latestMessageRecord.text))) ||
      asString(rawChat.lastMessage) ||
      "No messages yet",
    unreadCount:
      asNumber(rawChat.unreadCount) ||
      asNumber(rawChat.unreadMessagesCount) ||
      asNumber(rawChat.unread),
    updatedAt:
      lastMessage?.createdAt ||
      toIsoString(rawChat.updatedAt) ||
      (latestMessageRecord && toIsoString(latestMessageRecord.createdAt)),
    createdAt: toIsoString(rawChat.createdAt),
    isClosed:
      status.toLowerCase() === "closed" ||
      asBoolean(rawChat.isClosed) ||
      asBoolean(rawChat.closed),
    status,
  };
}

async function getCollectionByCandidates(candidates: string[]) {
  await connectToDatabase();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }
  const collections = await db.listCollections().toArray();
  const collectionNames = new Set(collections.map((collection) => collection.name));

  const matchedName = candidates.find((candidate) => collectionNames.has(candidate));
  return matchedName ? db.collection(matchedName) : null;
}

async function getChatCollection() {
  return getCollectionByCandidates(CHAT_COLLECTION_CANDIDATES);
}

async function getMessageCollection() {
  return getCollectionByCandidates(MESSAGE_COLLECTION_CANDIDATES);
}

function toObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function buildChatFilter(chatId: string) {
  const objectId = toObjectId(chatId);

  if (objectId) {
    return { $or: [{ _id: objectId }, { id: chatId }, { chatId }] };
  }
  return { $or: [{ id: chatId }, { chatId }] };
}

function buildMessageFilter(chatId: string) {
  const objectId = toObjectId(chatId);

  return objectId
    ? {
        $or: [{ chatId }, { chatId: objectId }, { "chat._id": objectId }, { "chat.id": chatId }],
      }
    : { $or: [{ chatId }, { "chat.id": chatId }] };
}

async function getEmbeddedMessages(chatDocument: MongoDocument, chatId: string) {
  const rawMessages = Array.isArray(chatDocument.messages) ? chatDocument.messages : [];

  return rawMessages
    .map((message) => asRecord(message))
    .filter((message): message is Record<string, unknown> => Boolean(message))
    .map((message) => normalizeChatMessage(message, chatId))
    .sort((left, right) => {
      const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
      return leftTime - rightTime;
    });
}

export async function listChats() {
  const [chatCollection, messageCollection] = await Promise.all([
    getChatCollection(),
    getMessageCollection(),
  ]);

  if (!chatCollection) {
    return [];
  }

  const chatDocuments = (await chatCollection
    .find({})
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray()) as MongoDocument[];

  if (messageCollection) {
    const chats = await Promise.all(
      chatDocuments.map(async (chatDocument) => {
        const chatId = getChatId(chatDocument);
        const latestMessageDocument = (await messageCollection.find(buildMessageFilter(chatId))
          .sort({ createdAt: -1, timestamp: -1, _id: -1 })
          .limit(1)
          .next()) as MongoDocument | null;

        const latestMessage = latestMessageDocument
          ? normalizeChatMessage(latestMessageDocument, chatId)
          : undefined;

        return normalizeChat(chatDocument, latestMessage);
      })
    );

    return chats.sort((left, right) => {
      const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
      const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
      return rightTime - leftTime;
    });
  }

  return chatDocuments.map((chatDocument) => {
    const embeddedMessages = Array.isArray(chatDocument.messages)
      ? chatDocument.messages
          .map((message) => asRecord(message))
          .filter((message): message is Record<string, unknown> => Boolean(message))
          .map((message) => normalizeChatMessage(message, getChatId(chatDocument)))
      : [];

    const latestMessage = embeddedMessages.at(-1);
    return normalizeChat(chatDocument, latestMessage);
  });
}

export async function listMessages(chatId: string, page: number, limit: number) {
  const [chatCollection, messageCollection] = await Promise.all([
    getChatCollection(),
    getMessageCollection(),
  ]);

  if (messageCollection) {
    const filter = buildMessageFilter(chatId);
    const [total, documents] = await Promise.all([
      messageCollection.countDocuments(filter),
      messageCollection
        .find(filter)
        .sort({ createdAt: 1, timestamp: 1, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
    ]);

    return {
      messages: (documents as MongoDocument[]).map((document) =>
        normalizeChatMessage(document, chatId)
      ),
      total,
    };
  }

  if (!chatCollection) {
    return { messages: [], total: 0 };
  }

  const chatDocument = (await chatCollection.findOne(buildChatFilter(chatId))) as MongoDocument | null;

  if (!chatDocument) {
    return { messages: [], total: 0 };
  }

  const embeddedMessages = await getEmbeddedMessages(chatDocument, chatId);
  const startIndex = Math.max(0, (page - 1) * limit);

  return {
    messages: embeddedMessages.slice(startIndex, startIndex + limit),
    total: embeddedMessages.length,
  };
}

export async function appendMessage(chatId: string, text: string) {
  const [chatCollection, messageCollection] = await Promise.all([
    getChatCollection(),
    getMessageCollection(),
  ]);

  if (!chatCollection) {
    throw new Error("Chat collection not found.");
  }

  const now = new Date();
  const filter = buildChatFilter(chatId);
  const chatDocument = (await chatCollection.findOne(filter)) as MongoDocument | null;

  if (!chatDocument) {
    throw new Error("Chat not found.");
  }

  const chatObjectId = toObjectId(getChatId(chatDocument));
  const messageDocument: MongoDocument = {
    chatId: chatObjectId ?? getChatId(chatDocument),
    sender: "admin",
    message: text,
    text,
    createdAt: now,
    updatedAt: now,
    isAdmin: true,
  };

  if (messageCollection) {
    const inserted = await messageCollection.insertOne(messageDocument);

    await chatCollection.updateOne(filter, {
      $set: {
        updatedAt: now,
        lastMessagePreview: text,
        status: "open",
      },
    });

    return normalizeChatMessage(
      { ...messageDocument, _id: inserted.insertedId, chatId: getChatId(chatDocument) },
      getChatId(chatDocument)
    );
  }

  await chatCollection.updateOne(filter, {
    $push: { messages: messageDocument } as any,
    $set: {
      updatedAt: now,
      lastMessagePreview: text,
      status: "open",
    },
  });

  return normalizeChatMessage(messageDocument, getChatId(chatDocument));
}

type CreateChatInput = {
  userId?: string;
  participantName?: string;
  participantEmail?: string;
  name?: string;
  email?: string;
};

export async function createChatThread(input: CreateChatInput) {
  await connectToDatabase();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }
  const chatCollection =
    (await getChatCollection()) ?? db.collection(CHAT_COLLECTION_CANDIDATES[0]);

  const now = new Date();
  const participantName =
    input.participantName?.trim() ||
    input.name?.trim() ||
    "New conversation";
  const participantEmail = input.participantEmail?.trim() || input.email?.trim() || null;

  const chatDocument: MongoDocument = {
    userId: input.userId ?? null,
    participantName,
    participantEmail,
    name: participantName,
    email: participantEmail,
    status: "open",
    isClosed: false,
    closed: false,
    unreadCount: 0,
    unreadMessagesCount: 0,
    unread: 0,
    lastMessagePreview: "",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  const inserted = await chatCollection.insertOne(chatDocument);

  return normalizeChat({
    ...chatDocument,
    _id: inserted.insertedId,
  });
}

export async function markChatRead(chatId: string) {
  const chatCollection = await getChatCollection();

  if (!chatCollection) {
    throw new Error("Chat collection not found.");
  }

  await chatCollection.updateOne(buildChatFilter(chatId), {
    $set: {
      unreadCount: 0,
      unreadMessagesCount: 0,
      unread: 0,
      updatedAt: new Date(),
    },
  });
}

export async function markChatClosed(chatId: string) {
  const chatCollection = await getChatCollection();

  if (!chatCollection) {
    throw new Error("Chat collection not found.");
  }

  await chatCollection.updateOne(buildChatFilter(chatId), {
    $set: {
      status: "closed",
      isClosed: true,
      closed: true,
      updatedAt: new Date(),
    },
  });
}
