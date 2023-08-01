export interface Message {
  message: string;
  username: string;
  room: string;
  date: Date;
}

export interface ServerToClientEvents {
  receiveMessage: (data: Message) => void;
  conversationHistory: (data: Message[]) => void;
}

export interface ClientToServerEvents {
  sendMessage: (data: Message) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}
