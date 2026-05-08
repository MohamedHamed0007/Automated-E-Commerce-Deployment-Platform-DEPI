import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { X, MessageCircle } from "lucide-react";
import { connectSocket, disconnectSocket } from "./socketIo";
import { ensureValidChatId, ensureGuestId, fetchChatMessages, getOrCreateChat } from "./chat";

type SenderType = "user" | "admin";

type RawSocketMessage = {
  _id?: string;
  clientMessageId?: string;
  chat?: string;
  chatId?: string;
  sender?: string | { _id: string };
  senderId?: string;
  receiverId?: string;
  senderType?: string;
  senderRole?: string;
  content?: string;
  text?: string;
  timestamp?: string;
  createdAt?: string;
  status?: "sent" | "delivered" | "seen";
};

interface ChatMessage extends RawSocketMessage {
  _id: string;
  senderId: string;
  receiverId?: string;
  timestamp: string;
  tempId?: string;
  isOptimistic?: boolean;
  senderType: SenderType;
  status?: "sent" | "delivered" | "seen";
}

type ApiMessage = {
  sender?: string | { _id?: string };
  senderId?: string;
  receiver?: string | { _id?: string };
  chat?: string | { _id?: string };
  _id?: unknown;
  content?: string;
  createdAt?: string | Date;
  timestamp?: string | Date;
  senderType?: string;
};

const CHAT_EVENTS = {
  JOIN: "chat:join",
  LEAVE: "chat:leave",
  SEND_MESSAGE: "chat:send_message",
  RECEIVE_MESSAGE: "chat:message",
  ERROR: "chat:error",
  JOINED: "chat:joined",
  TYPING: "chat:typing",
  TYPING_INDICATOR: "chat:typing_indicator",
};

const getClientMessageId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `temp-${Math.random().toString(36).slice(2)}`;

const normalizeSenderType = (senderType?: string): SenderType =>
  senderType === "admin" ? "admin" : "user";

const ChatBubble = ({ message, isMine }: { message: ChatMessage; isMine: boolean }) => {
  const wrapperClasses = isMine ? "flex justify-end" : "flex justify-start";
  const bubbleClasses = isMine
    ? "rounded-2xl rounded-br-none bg-blue-500 text-white text-sm leading-relaxed shadow-sm my-1"
    : "rounded-2xl rounded-bl-none bg-gray-200 text-black text-sm leading-relaxed shadow-sm border border-gray-300 my-1";
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const senderLabel = isMine ? "You" : "Admin";

  return (
    <div className={`${wrapperClasses} px-1`}>
      <div className={`${bubbleClasses} max-w-[75%] p-3 relative`}>
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className={`mt-1 flex items-center justify-between text-[10px] font-medium opacity-70`}>
          <span>{senderLabel}</span>
          <div className="flex items-center gap-2">
            {message.status === "failed" && <span className="text-rose-500">❌ Failed</span>}
            {message.isOptimistic && message.status !== "failed" && <span className="text-emerald-300">Sending...</span>}
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [adminTyping, setAdminTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      const guestId = ensureGuestId();
      const validChatId = await ensureValidChatId(undefined, guestId);
      setChatId(validChatId);

      // Load existing messages
      const existingMessages = await fetchChatMessages(validChatId, undefined, guestId);
      const normalizedMessages = existingMessages.map((msg: any) => ({
        _id: msg._id || msg.id || getClientMessageId(),
        senderId: msg.senderId || msg.sender,
        receiverId: msg.receiverId || msg.receiver,
        content: msg.content || msg.text || msg.message,
        timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
        senderType: normalizeSenderType(msg.senderType),
        status: "sent" as const,
      }));
      setMessages(normalizedMessages);

      // Connect socket
      const socket = connectSocket(undefined, validChatId, guestId);
      socketRef.current = socket;

      socket.on("connect", () => {
        setConnected(true);
        console.log("Connected to chat server");
      });

      socket.on("disconnect", () => {
        setConnected(false);
        console.log("Disconnected from chat server");
      });

      socket.on(CHAT_EVENTS.RECEIVE_MESSAGE, (data: RawSocketMessage) => {
        const newMessage: ChatMessage = {
          _id: data._id || getClientMessageId(),
          senderId: data.senderId || "",
          receiverId: data.receiverId || undefined,
          content: data.content || data.text || "",
          timestamp: data.createdAt || data.timestamp || new Date().toISOString(),
          senderType: normalizeSenderType(data.senderType || data.senderRole),
          status: "delivered",
        };
        setMessages(prev => [...prev, newMessage]);
      });

      socket.on(CHAT_EVENTS.TYPING_INDICATOR, (data: { isTyping: boolean }) => {
        setAdminTyping(data.isTyping);
      });

      socket.on(CHAT_EVENTS.ERROR, (error: { message: string }) => {
        console.error("Chat error:", error.message);
      });

    } catch (error) {
      console.error("Failed to initialize chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current || !chatId) return;

    const messageContent = input.trim();
    const tempId = getClientMessageId();
    const optimisticMessage: ChatMessage = {
      _id: tempId,
      senderId: "user",
      content: messageContent,
      timestamp: new Date().toISOString(),
      senderType: "user",
      isOptimistic: true,
      status: "sent",
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setInput("");

    try {
      socketRef.current.emit(CHAT_EVENTS.SEND_MESSAGE, {
        chatId,
        content: messageContent,
        clientMessageId: tempId,
      }, (response: any) => {
        if (response.success) {
          setMessages(prev =>
            prev.map(msg =>
              msg._id === tempId
                ? { ...msg, _id: response.message._id, isOptimistic: false, status: "delivered" }
                : msg
            )
          );
        } else {
          setMessages(prev =>
            prev.map(msg =>
              msg._id === tempId
                ? { ...msg, status: "failed" as const }
                : msg
            )
          );
        }
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev =>
        prev.map(msg =>
          msg._id === tempId
            ? { ...msg, status: "failed" as const }
            : msg
        )
      );
    }
  };

  const handleOpenChat = async () => {
    setIsOpen(true);
    if (!chatId) {
      await initializeChat();
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    disconnectSocket();
    socketRef.current = null;
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleOpenChat}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-500 text-white rounded-t-lg">
          <h3 className="font-semibold">Chat Support</h3>
          <button
            onClick={handleCloseChat}
            className="hover:bg-blue-600 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((message) => (
              <ChatBubble
                key={message._id}
                message={message}
                isMine={message.senderType === "user"}
              />
            ))
          )}
          {adminTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-2xl rounded-bl-none px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!connected || loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || !connected || loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          {!connected && (
            <div className="text-xs text-gray-500 mt-1">Connecting...</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;