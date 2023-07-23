import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import session from "express-session";
import mongoose from "mongoose";
import errorMiddleware from "./middleware/errorMiddleware";
import logRequest from "./middleware/logRequest";
import validateUser from "./middleware/validateUser";
import userRoutes from "./routes/userRoutes";
dotenv.config();

const app = express();
app.use("/", logRequest);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const port = process.env.PORT || 3000;
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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/protected", validateUser, (req: Request, res: Response) => {
  res.send("Protected route");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(errorMiddleware);
