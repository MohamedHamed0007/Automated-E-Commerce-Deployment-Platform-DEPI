"use client";

import type { ChatMessage } from "@/types/Chat";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAdmin = message.sender === "admin";

  return (
    <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
          isAdmin
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md border border-gray-200 bg-white text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
        <div
          className={`mt-2 text-[11px] ${
            isAdmin ? "text-blue-100" : "text-gray-400 dark:text-gray-500"
          }`}
        >
          <span>{formatMessageDate(message.createdAt)}</span>
          {message.pending ? <span className="ml-2">Sending...</span> : null}
        </div>
      </div>
    </div>
  );
}

function formatMessageDate(value?: string | null) {
  if (!value) {
    return "Now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
