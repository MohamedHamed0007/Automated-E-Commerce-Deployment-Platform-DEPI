"use client";

import { ArchiveX, RefreshCcw } from "lucide-react";
import { useEffect, useRef } from "react";

import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage, ChatSummary } from "@/types/Chat";

type ChatWindowProps = {
  chat: ChatSummary | null;
  messages: ChatMessage[];
  loading: boolean;
  sending: boolean;
  closing: boolean;
  onSend: (message: string) => void;
  onCloseChat: () => void;
  onRefresh: () => void;
};

export function ChatWindow({
  chat,
  messages,
  loading,
  sending,
  closing,
  onSend,
  onCloseChat,
  onRefresh,
}: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-950">
        Select a chat from the sidebar to view messages.
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {chat.participantName}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {chat.participantEmail || "Customer conversation"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={onCloseChat}
            disabled={chat.isClosed || closing}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <ArchiveX className="h-4 w-4" />
            {chat.isClosed ? "Closed" : closing ? "Closing..." : "Close chat"}
          </button>
        </div>
      </div>

      <div className="chat-scrollbar flex-1 overflow-y-auto bg-gray-50/80 px-5 py-5 dark:bg-gray-950">
        {loading && messages.length === 0 ? (
          <div className="text-sm text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-gray-400">No messages yet in this conversation.</div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {chat.isClosed ? (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          This chat is closed. Sending new replies has been disabled.
        </div>
      ) : null}

      <ChatInput disabled={chat.isClosed} sending={sending} onSend={onSend} />
    </section>
  );
}
