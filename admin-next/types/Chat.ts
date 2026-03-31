export interface ChatSummary {
  _id: string;
  participantName: string;
  participantEmail?: string | null;
  avatar?: string | null;
  lastMessage: string;
  unreadCount: number;
  updatedAt?: string | null;
  createdAt?: string | null;
  isClosed: boolean;
  status: string;
}

export interface ChatMessage {
  _id: string;
  chatId: string;
  sender: "user" | "admin" | "bot" | "system";
  text: string;
  createdAt?: string | null;
  pending?: boolean;
}

export interface ChatMessagesResult {
  messages: ChatMessage[];
  total: number;
  page: number;
  limit: number;
}
