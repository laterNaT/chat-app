import { RequestHandler } from "express";
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import registerConversationHandler from "../sockets/conversationHandler";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/my_types/sockets";

export function createSockets(
  httpServer: HttpServer,
  sessionMiddleware: RequestHandler,
) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    },
  );

  const onConnection = (
    socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  ) => {
    registerConversationHandler(io, socket);
  };

  io.engine.use(sessionMiddleware);

  io.on("connection", onConnection);
  return io;
}
