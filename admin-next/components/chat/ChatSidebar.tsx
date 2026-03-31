"use client";

import type { ChatSummary } from "@/types/Chat";

type ChatSidebarProps = {
  chats: ChatSummary[];
  activeChatId: string | null;
  loading: boolean;
  onSelect: (chatId: string) => void;
};

export function ChatSidebar({
  chats,
  activeChatId,
  loading,
  onSelect,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Support Chats</h1>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? "Loading conversations..." : `${chats.length} total conversations`}
        </p>
      </div>

      <div className="chat-scrollbar flex-1 overflow-y-auto">
        {loading && chats.length === 0 ? (
          <div className="p-4 text-sm text-gray-400">Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-sm text-gray-400">No chats found.</div>
        ) : (
          chats.map((chat) => {
            const isActive = chat._id === activeChatId;

            return (
              <button
                key={chat._id}
                type="button"
                onClick={() => onSelect(chat._id)}
                className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-4 text-left transition dark:border-gray-900 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <Avatar name={chat.participantName} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {chat.participantName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {chat.participantEmail || "Customer conversation"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] text-gray-400">
                        {formatListDate(chat.updatedAt || chat.createdAt)}
                      </span>
                      {chat.unreadCount > 0 ? (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                          {chat.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {chat.lastMessage}
                    </p>
                    {chat.isClosed ? (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        Closed
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
      {initials || "?"}
    </div>
  );
}

function formatListDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}
