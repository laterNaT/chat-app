import { createServer } from "http";
import mongoose from "mongoose";
import { createApp, getMongoUrl } from "./utils/createApp";
import { createSockets } from "./utils/createSockets";
require("dotenv").config({ path: __dirname + "/../.env" });

const PORT = process.env.PORT || 3000;
const { app, sessionMiddleware } = createApp();
const httpServer = createServer(app);
const io = createSockets(httpServer, sessionMiddleware);

mongoose.connect(getMongoUrl()!);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
