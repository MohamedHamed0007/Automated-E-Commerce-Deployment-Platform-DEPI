import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchChats, setActiveChatId } from "@/store/chatSlice";
import { ChatSummary } from "@/types/Chat";

interface ChatSidebarProps {
  onChatSelect: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onChatSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, loadingChats, activeChatId } = useSelector(
    (state: RootState) => state.chat
  );

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleChatClick = (chat: ChatSummary) => {
    dispatch(setActiveChatId(chat._id));
    onChatSelect(chat._id);
  };

  const formatTime = (timestamp?: string | null) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return "";
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loadingChats ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading chats...</div>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">No chats available</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {chats.map((chat: ChatSummary) => (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeChatId === chat._id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {chat.participantName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {chat.lastMessage}
                    </p>
                    {chat.participantEmail && (
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {chat.participantEmail}
                      </p>
                    )}
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {chat.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
                {chat.isClosed && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Closed
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;