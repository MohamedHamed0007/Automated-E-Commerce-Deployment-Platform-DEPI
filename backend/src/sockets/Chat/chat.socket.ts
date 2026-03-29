import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { Chat } from '../../config/DB/Models/Chat/Chat.model';
import { Message } from '../../config/DB/Models/Message/Message.model';

export const CHAT_EVENTS = {
  // Client → Server
  JOIN_CHAT: 'chat:join',
  LEAVE_CHAT: 'chat:leave',
  SEND_MESSAGE: 'chat:sendMessage',
  MARK_READ: 'chat:markRead',
  TYPING: 'chat:typing',

  // Server → Client
  NEW_MESSAGE: 'chat:newMessage',
  MESSAGES_READ: 'chat:messagesRead',
  TYPING_INDICATOR: 'chat:typingIndicator',
  ADMIN_JOINED: 'chat:adminJoined',
  ERROR: 'chat:error',
  JOINED: 'chat:joined',
} as const;

interface AuthUser {
  _id: string;
  role: 'user' | 'admin';
  email: string;
}

interface SendMessagePayload {
  chatId: string;
  content: string;
}

interface JoinChatPayload {
  chatId: string;
}

const canAccessChat = async (
  chatId: string,
  user: AuthUser
): Promise<boolean> => {
  if (user.role === 'admin') return true; // admins see all chats

  const chat = await Chat.findById(chatId).lean();
  if (!chat) return false;

  return chat.participants.some((p) => p.toString() === user._id);
};

/*  Main registration function — called once from Socket.server.ts  */

export const registerChatSocket = (io: Server): void => {
  io.on('connection', async (socket: Socket) => {
    const user = socket.data.user as AuthUser;
    console.log(`Socket connected: ${user.email} [${user.role}]`);

    // ── ADMIN: join ALL active chat rooms immediately ────────────────────
    if (user.role === 'admin') {
      const chats = await Chat.find({}).select('_id');
      const roomIds = chats.map((c) => c._id.toString());
      roomIds.forEach((id) => socket.join(id));

      socket.emit(CHAT_EVENTS.ADMIN_JOINED, {
        message: `Joined ${roomIds.length} active chat rooms`,
        rooms: roomIds,
      });
    }

    // ── EVENT: join a chat room ──────────────────────────────────────────
    socket.on(
      CHAT_EVENTS.JOIN_CHAT,
      async ({ chatId }: JoinChatPayload) => {
        try {
          if (!Types.ObjectId.isValid(chatId)) {
            return socket.emit(CHAT_EVENTS.ERROR, { message: 'Invalid chatId' });
          }

          const allowed = await canAccessChat(chatId, user);
          if (!allowed) {
            return socket.emit(CHAT_EVENTS.ERROR, {
              message: 'FORBIDDEN: you are not a participant of this chat',
            });
          }

          await socket.join(chatId);

          // Return the last 50 messages on join
          const history = await Message.find({ chat: chatId })
            .sort({ createdAt: 1 })
            .limit(50)
            .lean();

          socket.emit(CHAT_EVENTS.JOINED, { chatId, history });
        } catch {
          socket.emit(CHAT_EVENTS.ERROR, { message: 'Could not join chat' });
        }
      }
    );

    // ── LEAVE a chat room ────────────────────────────────────────────────
    socket.on(CHAT_EVENTS.LEAVE_CHAT, ({ chatId }: JoinChatPayload) => {
      socket.leave(chatId);
    });

    // ── SEND a message ───────────────────────────────────────────────────
    socket.on(
      CHAT_EVENTS.SEND_MESSAGE,
      async ({ chatId, content }: SendMessagePayload) => {
        try {
          if (!Types.ObjectId.isValid(chatId)) {
            return socket.emit(CHAT_EVENTS.ERROR, { message: 'Invalid chatId' });
          }

          if (!content || content.trim().length === 0) {
            return socket.emit(CHAT_EVENTS.ERROR, {
              message: 'Message content cannot be empty',
            });
          }

          if (content.length > 2000) {
            return socket.emit(CHAT_EVENTS.ERROR, {
              message: 'Message too long (max 2000 chars)',
            });
          }

          const allowed = await canAccessChat(chatId, user);
          if (!allowed) {
            return socket.emit(CHAT_EVENTS.ERROR, {
              message: 'FORBIDDEN: you are not a participant of this chat',
            });
          }

          // Persist message
          const message = await Message.create({
            chat: chatId,
            sender: user._id,
            senderType: user.role, // 'user' | 'admin'
            content: content.trim(),
            read: false,
          });

          // Update chat updatedAt so lists can be sorted by recent activity
          await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

          // Broadcast to everyone in the room (sender included)
          io.to(chatId).emit(CHAT_EVENTS.NEW_MESSAGE, {
            _id: message._id,
            chat: chatId,
            sender: user._id,
            senderType: message.senderType,
            content: message.content,
            read: message.read,
            createdAt: message.createdAt,
          });

          // If this is a new chat room, make sure all connected admin sockets join it
          const adminSockets = await io.fetchSockets();
          for (const s of adminSockets) {
            if (s.data.user?.role === 'admin' && !s.rooms.has(chatId)) {
              s.join(chatId);
            }
          }
        } catch {
          socket.emit(CHAT_EVENTS.ERROR, { message: 'Could not send message' });
        }
      }
    );

    // ── MARK messages as read ────────────────────────────────────────────
    socket.on(
      CHAT_EVENTS.MARK_READ,
      async ({ chatId }: JoinChatPayload) => {
        try {
          if (!Types.ObjectId.isValid(chatId)) return;

          const allowed = await canAccessChat(chatId, user);
          if (!allowed) return;

          // Mark all messages NOT sent by this user as read
          await Message.updateMany(
            { chat: chatId, sender: { $ne: user._id }, read: false },
            { $set: { read: true } }
          );

          // Notify the room so the other side can update read receipts
          socket.to(chatId).emit(CHAT_EVENTS.MESSAGES_READ, {
            chatId,
            readBy: user._id,
          });
        } catch {
          socket.emit(CHAT_EVENTS.ERROR, {
            message: 'Could not mark messages as read',
          });
        }
      }
    );

    // ── TYPING indicator ─────────────────────────────────────────────────
    socket.on(CHAT_EVENTS.TYPING, ({ chatId }: { chatId: string }) => {
      // Broadcast to room EXCEPT the person typing
      socket.to(chatId).emit(CHAT_EVENTS.TYPING_INDICATOR, {
        chatId,
        userId: user._id,
        senderType: user.role,
      });
    });

    // ── DISCONNECT ───────────────────────────────────────────────────────
    socket.on('disconnect', (reason: string) => {
      console.log(`Socket disconnected [${user._id}] reason: ${reason}`);
    });
  });
};
