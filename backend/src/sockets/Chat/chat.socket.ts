import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { Chat } from '../../config/DB/Models/Chat/Chat.model';
import { Message, SenderType } from '../../config/DB/Models/Message/Message.model';
import * as chatService from '../../Services/chat/chat.service';

export const CHAT_EVENTS = {
  JOIN: 'chat:join',
  LEAVE: 'chat:leave',
  SEND_MESSAGE: 'chat:message',
  RECEIVE_MESSAGE: 'chat:message',
  ERROR: 'chat:error',
  JOINED: 'chat:joined',
  MARK_READ: 'chat:mark_read',
  MESSAGES_READ: 'chat:messages_read',
  TYPING: 'chat:typing',
  TYPING_INDICATOR: 'chat:typing_indicator',
  MESSAGE_STATUS: 'chat:message_status',
} as const;

interface AuthUser {
  _id: string;
  role: 'user' | 'admin' | 'customer' | 'driver' | 'guest';
  email: string;
}

interface PrivateMessagePayload {
  chatId: string;
  content: string;
  receiverId?: string;
  clientMessageId?: string;
}

interface JoinChatPayload {
  chatId: string;
}

const isAdminRole = (role: string) => role === 'admin';
const normalizeSenderType = (role: string): SenderType =>
  role === 'admin' ? 'admin' : 'user';

const canAccessChat = async (chatId: string, user: AuthUser): Promise<boolean> => {
  const chat = await Chat.findById(chatId).lean();
  if (!chat) return false;

  // ✅ admin يدخل أي شات
  if (user.role === 'admin') return true;

  return chat.participants.some((p) => p.toString() === user._id);
};

const USER_ROOM = (userId: string) => `user_${userId}`;
const ADMIN_ROOM = 'admin_room';
const ADMIN_ROOM_BY_ID = (adminId: string) => `admin:${adminId}`;
const CHAT_ROOM = (chatId: string) => String(chatId);

export const toSocketMessage = (message: {
  _id: { toString(): string };
  chat: { toString(): string };
  sender: { toString(): string };
  receiver?: { toString(): string } | null;
  senderType: SenderType;
  content: string;
  read: boolean;
  createdAt: Date;
}) => ({
  _id: message._id.toString(),
  chatId: message.chat.toString(),
  senderId: message.sender.toString(),
  receiverId: message.receiver?.toString() ?? null,
  senderType: message.senderType === 'customer' ? 'user' : message.senderType,
  content: message.content,
  read: message.read,
  createdAt: message.createdAt.toISOString(),
});

export const registerChatSocket = (io: Server): void => {
  io.on('connection', async (socket: Socket) => {
    const user = socket.data.user as AuthUser;
    console.log("Client connected:", socket.id);
    socket.join(USER_ROOM(user._id));

    if (isAdminRole(user.role)) {
      socket.join(ADMIN_ROOM);
      socket.join(ADMIN_ROOM_BY_ID(user._id));
    }

    // ================= INITIAL CHAT ROOM JOIN =================
    // If client passes chatId in handshake, join it immediately.
    // This improves reliability during refresh / reconnect.
    const initialChatId = (socket.handshake.auth as any)?.chatId as string | undefined;
    if (initialChatId && Types.ObjectId.isValid(initialChatId)) {
      try {
        const allowed = await canAccessChat(initialChatId, user);
        if (allowed) {
          socket.join(CHAT_ROOM(initialChatId));
          console.log('[chat] joined room on connect', { socketId: socket.id, room: CHAT_ROOM(initialChatId) });
        }
      } catch {
        // ignore room join failures; client will re-join explicitly via JOIN event
      }
    }

    // ================= JOIN CHAT =================
    socket.on(CHAT_EVENTS.JOIN, async ({ chatId }: JoinChatPayload) => {
      try {
        if (!Types.ObjectId.isValid(chatId)) {
          return socket.emit(CHAT_EVENTS.ERROR, { message: 'Invalid chatId' });
        }

        let requestedChatId = chatId;
        let chat = (await Chat.findById(requestedChatId)) as any;
        if (!chat && user.role === 'guest') {
          const recoveredChat = await chatService.createChat({ userId: user._id });
          chat = (await Chat.findById(recoveredChat._id.toString())) as any;
          requestedChatId = recoveredChat._id.toString();
          console.log('[chat] created guest recovery chat', { socketId: socket.id, newChatId: requestedChatId });
        }

        if (!chat) {
          return socket.emit(CHAT_EVENTS.ERROR, { message: 'Chat not found' });
        }

        let allowed = await canAccessChat(requestedChatId, user);
        if (!allowed && user.role === 'guest') {
          const oldChatId = requestedChatId;
          const recoveredChat = await chatService.createChat({ userId: user._id });
          chat = await Chat.findById(recoveredChat._id.toString());
          requestedChatId = recoveredChat._id.toString();
          allowed = true;
          console.log('[chat] recovered guest chat', { socketId: socket.id, oldChatId, newChatId: requestedChatId });
        }

        if (!allowed) {
          return socket.emit(CHAT_EVENTS.ERROR, { message: 'Forbidden: you are not a participant of this chat' });
        }

        const room = CHAT_ROOM(requestedChatId);
        await socket.join(room);
        console.log('[chat] joined room', { socketId: socket.id, userId: user._id, room });

        const history = await Message.find({ chat: requestedChatId })
          .sort({ createdAt: 1 })
          .limit(50)
          .lean();

        const sanitizedHistory = history.map((message) =>
          toSocketMessage({
            _id: message._id,
            chat: message.chat,
            sender: message.sender,
            receiver: message.receiver,
            senderType: message.senderType,
            content: message.content,
            read: message.read,
            createdAt: message.createdAt,
          })
        );

        const otherParticipantId = ((chat?.participants ?? []) as { toString(): string }[])
          .map((participant) => participant.toString())
          .find((participantId) => participantId !== user._id) ?? null;

        socket.emit(CHAT_EVENTS.JOINED, {
          chatId: requestedChatId,
          history: sanitizedHistory,
          chatMeta: { otherParticipantId },
        });

      } catch (err) {
        socket.emit(CHAT_EVENTS.ERROR, { message: 'Could not join chat' });
      }
    });

    // ================= LEAVE CHAT =================
    socket.on(CHAT_EVENTS.LEAVE, ({ chatId }: JoinChatPayload) => {
      socket.leave(CHAT_ROOM(chatId));
    });

    // ================= SEND MESSAGE =================
    socket.on(CHAT_EVENTS.SEND_MESSAGE, async ({ chatId, content, receiverId, clientMessageId }: PrivateMessagePayload, callback?: Function) => {
      try {
        const senderType = normalizeSenderType(user.role);
        const finalSenderId = user._id;

        console.log('[chat] incoming send_message', {
          senderId: finalSenderId,
          authUserId: user._id,
          role: user.role,
          chatId,
          receiverId,
          clientMessageId,
          content,
        });

        if (!Types.ObjectId.isValid(chatId)) {
          return socket.emit(CHAT_EVENTS.ERROR, { message: 'Invalid chatId' });
        }

        if (!content || content.trim().length === 0) {
          return socket.emit(CHAT_EVENTS.ERROR, { message: 'Message cannot be empty' });
        }

        const allowed = await canAccessChat(chatId, user);
        if (!allowed) {
          return socket.emit(CHAT_EVENTS.ERROR, { message: 'Forbidden: you are not a participant of this chat' });
        }

        const message = await chatService.sendMessage({
          chatId,
          senderId: finalSenderId,
          senderType,
          content: content.trim(),
          receiverId:
            receiverId && Types.ObjectId.isValid(receiverId) ? receiverId : undefined,
        });

        console.log('[chat] socket message saved', {
          chatId,
          messageId: message._id.toString(),
          senderId: finalSenderId,
          senderType,
        });

        const socketPayload = {
          _id: message._id.toString(),
          text: message.content,
          senderId: message.sender.toString(),
          senderRole: message.senderType === 'admin' ? 'admin' : 'user',
          chatId: message.chat.toString(),
          createdAt: message.createdAt.toISOString(),
          clientMessageId
        };

        const chatDoc = await Chat.findById(chatId).lean();
        const targetUser = chatDoc?.participants.find(p => p.toString() !== finalSenderId.toString());

        console.log("Sender Role:", socketPayload.senderRole);
        console.log("Emitting to:", senderType === 'admin' ? `user_${targetUser}` : "admin_room");

        if (typeof callback === 'function') {
          callback({ success: true, message: socketPayload });
        }
      } catch (err) {
        console.error('chat send_message error:', err);
        socket.emit(CHAT_EVENTS.ERROR, { message: 'Could not send message' });
        if (typeof callback === 'function') {
          callback({ success: false, error: err instanceof Error ? err.message : String(err) });
        }
      }
    });

    // ================= MARK READ =================
    socket.on(CHAT_EVENTS.MARK_READ, async ({ chatId }: JoinChatPayload) => {
      try {
        const allowed = await canAccessChat(chatId, user);
        if (!allowed) return;

        await Message.updateMany(
          { chat: chatId, sender: { $ne: user._id }, read: false },
          { $set: { read: true } }
        );

        socket.to(CHAT_ROOM(chatId)).emit(CHAT_EVENTS.MESSAGES_READ, {
          chatId,
          readBy: user._id,
        });

      } catch {
        socket.emit(CHAT_EVENTS.ERROR, { message: 'Could not mark messages as read' });
      }
    });

    // ================= TYPING =================
    socket.on(CHAT_EVENTS.TYPING, ({ chatId, isTyping }: { chatId: string; isTyping: boolean }) => {
      socket.to(CHAT_ROOM(chatId)).emit(CHAT_EVENTS.TYPING_INDICATOR, {
        chatId,
        userId: user._id,
        senderType: normalizeSenderType(user.role),
        isTyping: Boolean(isTyping),
      });
    });

    // ================= DISCONNECT =================
    socket.on('disconnect', (reason: string) => {
      console.log(`Socket disconnected [${user._id}] reason: ${reason}`);
    });
  });
};