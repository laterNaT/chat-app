import { createServer } from "http";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import registerConversationHandler from "./sockets/conversationHandler";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./types/my_types/sockets";
import { createApp, getMongoUrl } from "./utils/createApp";

require("dotenv").config({ path: __dirname + "/../.env" });

const { app, sessionMiddleware } = createApp();
mongoose.connect(getMongoUrl()!);
const httpServer = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.engine.use(sessionMiddleware);

io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.isAuthorized) {
    next();
  } else {
    console.log("unauthorized socket request denied");
    next(new Error("unauthorized"));
  }
});

const onConnection = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  registerConversationHandler(io, socket);
};

io.on("connection", onConnection);

httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
