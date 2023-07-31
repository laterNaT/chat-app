import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  Message,
  ServerToClientEvents,
} from "../types/my_types/sockets";

const registerConversationHandler = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  const joinConversation = (conversationId: string) => {
    socket.join(conversationId);
  };

  const leaveConversation = (conversationId: string) => {
    socket.leave(conversationId);
  };

  const sendMessage = (data: Message) => {
    const { message, username, room, sentAt } = data;
    io.in(room).emit("receiveMessage", data);
  };

  const disconnect = () => {
    socket.disconnect();
    console.log("user disconnected", socket.id);
  };

  socket.on("joinConversation", joinConversation);
  socket.on("leaveConversation", leaveConversation);
  socket.on("sendMessage", sendMessage);
  socket.on("disconnect", disconnect);
};

export default registerConversationHandler;
