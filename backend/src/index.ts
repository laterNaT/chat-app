import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "./middleware/errorMiddleware";
import logRequest from "./middleware/logRequest";
import conversationRoutes from "./routes/conversationRoutes";
import friendRoutes from "./routes/friendRoutes";
import userRoutes from "./routes/userRoutes";
import * as swaggerDocument from "./swagger.json";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

app.use("/", logRequest);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
mongoose.connect(process.env.MONGODB_URI!);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    name: "session",
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI! }),
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/conversation", conversationRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected with id", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(errorMiddleware);
