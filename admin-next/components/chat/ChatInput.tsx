"use client";

import { SendHorizonal } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

type ChatInputProps = {
  disabled?: boolean;
  sending?: boolean;
  onSend: (message: string) => void;
};

export function ChatInput({ disabled = false, sending = false, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const submit = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled || sending) {
      return;
    }

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "This chat is closed" : "Type a reply..."}
          disabled={disabled}
          className="h-10 flex-1 bg-transparent px-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed dark:text-white dark:placeholder:text-gray-500"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || sending || message.trim().length === 0}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
          aria-label="Send reply"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
