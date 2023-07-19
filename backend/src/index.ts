import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import errorMiddleware from "./middleware/errorMiddleware";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI!);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(errorMiddleware);
