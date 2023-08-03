import MongoStore from "connect-mongo";
import cors from "cors";
import express from "express";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "../middleware/errorMiddleware";
import logRequest from "../middleware/logRequest";
import conversationRoutes from "../routes/conversationRoutes";
import friendRoutes from "../routes/friendRoutes";
import userRoutes from "../routes/userRoutes";
import * as swaggerDocument from "../swagger.json";

require("dotenv").config({ path: __dirname + "/../../.env" });

export function getMongoUrl() {
  switch (process.env.NODE_ENV) {
    case "test":
      return process.env.MONGODB_URI_TEST;
    case "development":
      return process.env.MONGODB_URI_DEV;
    case "production":
      return process.env.MONGODB_URI_PROD;
    default:
      throw new Error("NODE_ENV not set");
  }
}

export function createApp() {
  const app = express();
  const mongoUrl = getMongoUrl();
  console.log("connecting to", mongoUrl);

  app.use("/", logRequest);
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  // mongoose.connect(mongoUrl!);

  const sessionMiddleware = session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    name: "session",
    store: MongoStore.create({
      mongoUrl: mongoUrl,
    }),
  });

  app.use(sessionMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/users", userRoutes);
  app.use("/api/friends", friendRoutes);
  app.use("/api/conversations", conversationRoutes);

  app.use(errorMiddleware);
  return { app, sessionMiddleware };
}
