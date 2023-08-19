import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
} from "../../../backend/src/types/my_types/sockets";

export const useSocketCommunication = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  path: string
) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("receiveMessage", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("conversationHistory", (data: Message[]) => {
      setMessages([...data]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("conversationHistory");
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("joinConversation", path);
  }, [socket, path]);

  const sendMessage = (data: Message) => {
    socket.emit("sendMessage", data);
  };

  return { messages, sendMessage };
};
