import { Server, Socket } from "socket.io";
import conversationModel from "../models/conversationModel";
import {
  ClientToServerEvents,
  Message,
  ServerToClientEvents,
} from "../types/my_types/sockets";

const registerConversationHandler = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  const joinConversation = async (conversationId: string) => {
    // TODO: IMPORTANT WRAP IN TRY CATCH
    // TODO: MOVE DB LOGIC TO OWN FILE
    socket.join(conversationId);
    const messages = await conversationModel
      .findById(conversationId)
      .select("messages")
      .populate({
        path: "messages.sender",
        select: "username",
      })
      .exec();

    if (!messages) {
      socket.emit("conversationHistory", []);
      return;
    }

    const mappedMessages = messages?.messages.map((message) => {
      return {
        message: message.message,
        username: (message.sender as any).username,
        room: conversationId,
        date: message.date,
      };
    });

    socket.emit("conversationHistory", mappedMessages);
  };

  const leaveConversation = (conversationId: string) => {
    socket.leave(conversationId);
  };

  const sendMessage = async (data: Message) => {
    // TODO: IMPORTANT WRAP IN TRY CATCH
    // TODO: MOVE DB LOGIC TO OWN FILE
    const { message, username, room, date } = data;
    io.in(room).emit("receiveMessage", data);

    const conversation = await conversationModel.findById(room);
    conversation?.messages.push({
      sender: socket.request.session.userId,
      message,
      date: date,
    });

    await conversation?.save();
  };

  const disconnect = () => {
    socket.disconnect();
    console.log("user disconnected", socket.id);
  };

  io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.isAuthorized) {
      next();
    } else {
      console.log("unauthorized socket request denied");
      next(new Error("unauthorized"));
    }
  });

  socket.on("joinConversation", joinConversation);
  socket.on("leaveConversation", leaveConversation);
  socket.on("sendMessage", sendMessage);
  socket.on("disconnect", disconnect);
};

export default registerConversationHandler;
