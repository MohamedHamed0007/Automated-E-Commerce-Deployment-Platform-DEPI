"use client";

import { useEffect, useMemo } from "react";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import {
  clearChatError,
  closeSelectedChat,
  createChatForUser,
  fetchChatMessages,
  fetchChats,
  markSelectedChatAsRead,
  sendMessageToChat,
  setActiveChatId,
} from "@/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const MESSAGES_PAGE_SIZE = 50;
const POLLING_INTERVAL_MS = 5000;

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const {
    activeChatId,
    chats,
    closingChat,
    creatingChat,
    error,
    loadingChats,
    loadingMessages,
    messagesByChatId,
    sendingMessage,
  } = useAppSelector((state) => state.chat);

  const activeChat = useMemo(
    () => chats.find((chat) => chat._id === activeChatId) ?? null,
    [activeChatId, chats]
  );

  const activeMessages = activeChatId ? messagesByChatId[activeChatId] ?? [] : [];

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  useEffect(() => {
    if (!activeChatId) {
      return;
    }

    dispatch(fetchChatMessages({ chatId: activeChatId, page: 1, limit: MESSAGES_PAGE_SIZE }));
    dispatch(markSelectedChatAsRead(activeChatId));

    const intervalId = window.setInterval(() => {
      dispatch(
        fetchChatMessages({
          chatId: activeChatId,
          page: 1,
          limit: MESSAGES_PAGE_SIZE,
          silent: true,
        })
      );
      dispatch(fetchChats());
    }, POLLING_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [activeChatId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearChatError());
    };
  }, [dispatch]);

  const handleSelectChat = (chatId: string) => {
    dispatch(setActiveChatId(chatId));
  };

  const handleSendMessage = async (message: string) => {
    if (!activeChatId) {
      return;
    }

    await dispatch(sendMessageToChat({ chatId: activeChatId, message }));
  };

  const handleCloseChat = async () => {
    if (!activeChatId || activeChat?.isClosed) {
      return;
    }

    await dispatch(closeSelectedChat(activeChatId));
  };

  const handleRefresh = () => {
    if (activeChatId) {
      dispatch(
        fetchChatMessages({ chatId: activeChatId, page: 1, limit: MESSAGES_PAGE_SIZE })
      );
      dispatch(fetchChats());
    }
  };

  const handleCreateNewChat = async () => {
    await dispatch(
      createChatForUser({
        participantName: "New conversation",
        name: "New conversation",
      })
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Chat Inbox</h1>
          <p className="mt-1 text-sm text-gray-500">
            Live support conversations from the existing backend API.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNewChat}
          disabled={creatingChat}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {creatingChat ? "Creating..." : "New Chat"}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      ) : null}

      <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="min-h-0 overflow-hidden rounded-2xl">
          <ChatSidebar
            chats={chats}
            activeChatId={activeChatId}
            loading={loadingChats}
            onSelect={handleSelectChat}
          />
        </div>

        <div className="min-h-0">
          <ChatWindow
            chat={activeChat}
            messages={activeMessages}
            loading={loadingMessages || creatingChat}
            sending={sendingMessage || creatingChat}
            closing={closingChat}
            onSend={handleSendMessage}
            onCloseChat={handleCloseChat}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
}
