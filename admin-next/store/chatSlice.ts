import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import {
  closeChat,
  createChat,
  getChatMessages,
  getChats,
  markChatAsRead,
  sendChatMessage,
} from "@/services/chatApi";
import type { ChatMessage, ChatMessagesResult, ChatSummary } from "@/types/Chat";

interface FetchMessagesArgs {
  chatId: string;
  page?: number;
  limit?: number;
  silent?: boolean;
}

interface SendMessageArgs {
  chatId: string;
  message: string;
}

interface CreateChatArgs {
  userId?: string;
  participantName?: string;
  participantEmail?: string;
  name?: string;
  email?: string;
}

interface ChatState {
  chats: ChatSummary[];
  activeChatId: string | null;
  messagesByChatId: Record<string, ChatMessage[]>;
  messagesMetaByChatId: Record<string, { total: number; page: number; limit: number }>;
  creatingChat: boolean;
  loadingChats: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  closingChat: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  creatingChat: false,
  messagesByChatId: {},
  messagesMetaByChatId: {},
  loadingChats: false,
  loadingMessages: false,
  sendingMessage: false,
  closingChat: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const fetchChats = createAsyncThunk<ChatSummary[], void, { rejectValue: string }>(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      return await getChats();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch chats"));
    }
  }
);

export const fetchChatMessages = createAsyncThunk<
  { chatId: string; result: ChatMessagesResult; silent: boolean },
  FetchMessagesArgs,
  { rejectValue: string }
>("chat/fetchChatMessages", async ({ chatId, page = 1, limit = 20, silent = false }, { rejectWithValue }) => {
  try {
    const result = await getChatMessages(chatId, page, limit);
    return { chatId, result, silent };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch messages"));
  }
});

export const markSelectedChatAsRead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("chat/markSelectedChatAsRead", async (chatId, { rejectWithValue }) => {
  try {
    return await markChatAsRead(chatId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to mark chat as read"));
  }
});

export const sendMessageToChat = createAsyncThunk<
  { chatId: string },
  SendMessageArgs,
  { rejectValue: string }
>("chat/sendMessageToChat", async ({ chatId, message }, { dispatch, rejectWithValue }) => {
  const optimisticMessage: ChatMessage = {
    _id: `temp-${Date.now()}`,
    chatId,
    sender: "admin",
    text: message,
    createdAt: new Date().toISOString(),
    pending: true,
  };

  dispatch(addOptimisticMessage(optimisticMessage));

  try {
    await sendChatMessage(chatId, message);
    await dispatch(fetchChatMessages({ chatId, page: 1, limit: 50, silent: true })).unwrap();
    await dispatch(fetchChats()).unwrap();
    return { chatId };
  } catch (error) {
    dispatch(removeMessageById({ chatId, messageId: optimisticMessage._id }));
    return rejectWithValue(getErrorMessage(error, "Failed to send message"));
  }
});

export const closeSelectedChat = createAsyncThunk<string, string, { rejectValue: string }>(
  "chat/closeSelectedChat",
  async (chatId, { dispatch, rejectWithValue }) => {
    try {
      const closedChatId = await closeChat(chatId);
      await dispatch(fetchChats()).unwrap();
      return closedChatId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to close chat"));
    }
  }
);

export const createChatForUser = createAsyncThunk<
  ChatSummary,
  CreateChatArgs,
  { rejectValue: string }
>("chat/createChatForUser", async (payload, { rejectWithValue }) => {
  try {
    return await createChat(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to create chat"));
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChatId: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
      state.error = null;
    },
    addOptimisticMessage: (state, action: PayloadAction<ChatMessage>) => {
      const chatId = action.payload.chatId;
      const currentMessages = state.messagesByChatId[chatId] ?? [];
      state.messagesByChatId[chatId] = [...currentMessages, action.payload];

      const chat = state.chats.find((item) => item._id === chatId);
      if (chat) {
        chat.lastMessage = action.payload.text;
        chat.updatedAt = action.payload.createdAt;
      }
    },
    removeMessageById: (
      state,
      action: PayloadAction<{ chatId: string; messageId: string }>
    ) => {
      const { chatId, messageId } = action.payload;
      state.messagesByChatId[chatId] = (state.messagesByChatId[chatId] ?? []).filter(
        (message) => message._id !== messageId
      );
    },
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loadingChats = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loadingChats = false;
        state.error = null;
        state.chats = action.payload;

        if (!state.activeChatId && action.payload.length > 0) {
          state.activeChatId = action.payload[0]._id;
        }

        if (
          state.activeChatId &&
          !action.payload.some((chat) => chat._id === state.activeChatId)
        ) {
          state.activeChatId = action.payload[0]?._id ?? null;
        }
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loadingChats = false;
        state.error = action.payload ?? "Failed to fetch chats";
      })
      .addCase(fetchChatMessages.pending, (state, action) => {
        if (!action.meta.arg.silent) {
          state.loadingMessages = true;
        }
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.error = null;
        state.messagesByChatId[action.payload.chatId] = action.payload.result.messages;
        state.messagesMetaByChatId[action.payload.chatId] = {
          total: action.payload.result.total,
          page: action.payload.result.page,
          limit: action.payload.result.limit,
        };

        const latestMessage = action.payload.result.messages.at(-1);
        const chat = state.chats.find((item) => item._id === action.payload.chatId);
        if (chat && latestMessage) {
          chat.lastMessage = latestMessage.text;
          chat.updatedAt = latestMessage.createdAt;
        }
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload ?? "Failed to fetch messages";
      })
      .addCase(markSelectedChatAsRead.fulfilled, (state, action) => {
        const chat = state.chats.find((item) => item._id === action.payload);
        if (chat) {
          chat.unreadCount = 0;
        }
      })
      .addCase(markSelectedChatAsRead.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to mark chat as read";
      })
      .addCase(sendMessageToChat.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessageToChat.fulfilled, (state) => {
        state.sendingMessage = false;
        state.error = null;
      })
      .addCase(sendMessageToChat.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload ?? "Failed to send message";
      })
      .addCase(closeSelectedChat.pending, (state) => {
        state.closingChat = true;
        state.error = null;
      })
      .addCase(closeSelectedChat.fulfilled, (state, action) => {
        state.closingChat = false;
        state.error = null;
        const chat = state.chats.find((item) => item._id === action.payload);
        if (chat) {
          chat.isClosed = true;
          chat.status = "closed";
        }
      })
      .addCase(closeSelectedChat.rejected, (state, action) => {
        state.closingChat = false;
        state.error = action.payload ?? "Failed to close chat";
      })
      .addCase(createChatForUser.pending, (state) => {
        state.creatingChat = true;
        state.error = null;
      })
      .addCase(createChatForUser.fulfilled, (state, action) => {
        state.creatingChat = false;
        state.error = null;

        const existingChatIndex = state.chats.findIndex(
          (chat) => chat._id === action.payload._id
        );

        if (existingChatIndex >= 0) {
          state.chats[existingChatIndex] = action.payload;
        } else {
          state.chats.unshift(action.payload);
        }

        state.activeChatId = action.payload._id;
      })
      .addCase(createChatForUser.rejected, (state, action) => {
        state.creatingChat = false;
        state.error = action.payload ?? "Failed to create chat";
      });
  },
});

export const {
  addOptimisticMessage,
  clearChatError,
  removeMessageById,
  setActiveChatId,
} = chatSlice.actions;

export default chatSlice.reducer;
