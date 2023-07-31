export interface Message {
  message: string;
  username: string;
  room: string;
  sentAt: string;
}

export interface ServerToClientEvents {
  receiveMessage: (data: Message) => void;
}

export interface ClientToServerEvents {
  sendMessage: (data: Message) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}
