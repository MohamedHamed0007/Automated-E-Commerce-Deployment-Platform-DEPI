"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircleMore,
  Minimize2,
  SendHorizonal,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

type MessageSender = "user" | "bot";

type ChatMessage = {
  id: number;
  sender: MessageSender;
  text: string;
  timestamp: string;
};

const STORAGE_KEY = "shipsphere-chat-widget-open";
const BOT_REPLIES = [
  "I can help you navigate shipments, users, dashboards, and common admin flows.",
  "If you need anything urgent, I can guide you to the right dashboard section.",
  "That sounds good. Once the backend is wired up, this can be connected to real support data.",
  "I'm here. Ask about recent shipments, account issues, or operational workflows.",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: "bot",
    text: "Welcome to ShipSphere support. How can we help you today?",
    timestamp: formatTimestamp(new Date()),
  },
];

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getBotReply(input: string) {
  const normalized = input.trim().toLowerCase();

  if (normalized.includes("shipment")) {
    return "For shipment questions, I can help you trace status, delivery issues, or courier assignments.";
  }

  if (normalized.includes("user") || normalized.includes("account")) {
    return "For account requests, I can help with user access, permissions, and admin-side troubleshooting.";
  }

  if (normalized.includes("payment") || normalized.includes("invoice")) {
    return "Billing support is available too. We can review invoices, payment states, or failed checkout flows.";
  }

  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
}

type ChatButtonProps = {
  isOpen: boolean;
  unreadCount: number;
  onToggle: () => void;
};

function ChatButton({ isOpen, unreadCount, onToggle }: ChatButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.96 }}
      animate={
        isOpen
          ? { scale: 1, boxShadow: "0 12px 30px rgba(37, 99, 235, 0.22)" }
          : {
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 10px 24px rgba(37, 99, 235, 0.16)",
                "0 18px 40px rgba(37, 99, 235, 0.28)",
                "0 10px 24px rgba(37, 99, 235, 0.16)",
              ],
            }
      }
      transition={
        isOpen
          ? { duration: 0.2, ease: "easeOut" }
          : { duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
      }
      className="relative flex h-15 w-15 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-white shadow-xl ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:ring-white/10"
      aria-label={isOpen ? "Close support chat" : "Open support chat"}
      aria-expanded={isOpen}
    >
      <MessageCircleMore className="h-6 w-6" />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex min-h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-gray-950 px-1.5 text-[11px] font-semibold text-white shadow-sm dark:border-gray-950">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
    </motion.button>
  );
}

type MessageBubbleProps = {
  message: ChatMessage;
};

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md border border-white/60 bg-white/80 text-gray-700 backdrop-blur dark:border-white/10 dark:bg-white/8 dark:text-gray-100"
        }`}
      >
        <p className="text-sm leading-6">{message.text}</p>
        <p
          className={`mt-2 text-[11px] ${
            isUser ? "text-blue-100/90" : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {message.timestamp}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex justify-start"
    >
      <div className="rounded-2xl rounded-bl-md border border-white/60 bg-white/80 px-4 py-3 text-gray-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/8 dark:text-gray-300">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">typing...</span>
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-current"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{
                duration: 0.9,
                repeat: Number.POSITIVE_INFINITY,
                delay: dot * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

type ChatPanelProps = {
  messages: ChatMessage[];
  draft: string;
  isTyping: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

function ChatPanel({
  messages,
  draft,
  isTyping,
  onDraftChange,
  onSend,
  onClose,
  onMinimize,
  onKeyDown,
  messagesEndRef,
}: ChatPanelProps) {
  const isDisabled = draft.trim().length === 0;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 20 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex h-[500px] w-[350px] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/75 shadow-2xl ring-1 ring-black/5 backdrop-blur-2xl dark:border-white/10 dark:bg-[#0b1120]/75 dark:ring-white/10"
      aria-label="Support chat panel"
    >
      <div className="border-b border-black/5 bg-gradient-to-r from-blue-600/90 via-sky-500/90 to-cyan-400/90 px-5 py-4 text-white dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <h2 className="text-sm font-semibold tracking-wide">Support Chat</h2>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/85">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              <span>Online</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onMinimize}
              className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
              aria-label="Minimize chat"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="chat-scrollbar flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white/30 via-transparent to-blue-50/40 px-4 py-4 dark:from-white/[0.03] dark:to-slate-900/50">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping ? <TypingIndicator key="typing-indicator" /> : null}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-black/5 bg-white/70 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f172a]/80">
        <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white/85 p-2 shadow-sm dark:border-white/10 dark:bg-white/8">
          <input
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message..."
            className="h-10 flex-1 bg-transparent px-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={isDisabled}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-white/10 dark:disabled:text-gray-600"
            aria-label="Send message"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(INITIAL_MESSAGES.length);
  const messageIdRef = useRef(INITIAL_MESSAGES.length + 1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpenRef = useRef(isOpen);

  const scrollToBottom = useEffectEvent(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const nextIsOpen = storedValue === "true";

    const frame = window.requestAnimationFrame(() => {
      setIsOpen(nextIsOpen);
      setUnreadCount(nextIsOpen ? 0 : INITIAL_MESSAGES.length);
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, String(isOpen));
  }, [isOpen, isReady]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((current) => {
      const nextIsOpen = !current;

      if (nextIsOpen) {
        setUnreadCount(0);
      }

      return nextIsOpen;
    });
  };

  const handleSend = () => {
    const content = draft.trim();

    if (!content || isTyping) {
      return;
    }

    const outgoingMessage: ChatMessage = {
      id: messageIdRef.current++,
      sender: "user",
      text: content,
      timestamp: formatTimestamp(new Date()),
    };

    setMessages((current) => [...current, outgoingMessage]);
    setDraft("");
    setIsTyping(true);

    const reply = getBotReply(content);
    const delay = 1000 + Math.floor(Math.random() * 501);

    replyTimeoutRef.current = setTimeout(() => {
      const incomingMessage: ChatMessage = {
        id: messageIdRef.current++,
        sender: "bot",
        text: reply,
        timestamp: formatTimestamp(new Date()),
      };

      setMessages((current) => [...current, incomingMessage]);
      setIsTyping(false);
      setUnreadCount((current) => (isOpenRef.current ? 0 : current + 1));
      replyTimeoutRef.current = null;
    }, delay);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <div key="support-chat-panel" className="pointer-events-auto">
            <ChatPanel
              messages={messages}
              draft={draft}
              isTyping={isTyping}
              onDraftChange={setDraft}
              onSend={handleSend}
              onClose={() => {
                setIsOpen(false);
                setUnreadCount(0);
              }}
              onMinimize={() => {
                setIsOpen(false);
                setUnreadCount(0);
              }}
              onKeyDown={handleInputKeyDown}
              messagesEndRef={messagesEndRef}
            />
          </div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-auto">
        <ChatButton
          isOpen={isOpen}
          unreadCount={isReady ? unreadCount : 0}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}
