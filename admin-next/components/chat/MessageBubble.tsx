import React from "react";
import { ChatMessage } from "@/types/Chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (timestamp?: string | null) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <div className={`flex items-center justify-between mt-1 text-xs ${
          isOwn ? "text-blue-100" : "text-gray-500"
        }`}>
          <span>{isOwn ? "You" : "Customer"}</span>
          <span>{formatTime(message.createdAt)}</span>
        </div>
        {message.pending && (
          <div className="text-xs text-blue-200 mt-1">Sending...</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;