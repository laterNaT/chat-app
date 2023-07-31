import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "./middleware/errorMiddleware";
import logRequest from "./middleware/logRequest";
import conversationRoutes from "./routes/conversationRoutes";
import friendRoutes from "./routes/friendRoutes";
import userRoutes from "./routes/userRoutes";
import registerConversationHandler from "./sockets/conversationHandler";
import * as swaggerDocument from "./swagger.json";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./types/my_types/sockets";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use("/", logRequest);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
mongoose.connect(process.env.MONGODB_URI!);
const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  name: "session",
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI! }),
});
io.engine.use(sessionMiddleware);
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/conversations", conversationRoutes);

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

app.use(errorMiddleware);
