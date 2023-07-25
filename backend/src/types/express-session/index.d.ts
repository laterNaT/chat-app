import "express-session";
import mongoose from "mongoose";

declare module "express-session" {
  export interface SessionData {
    isAuthorized: boolean;
    userId: mongoose.Types.ObjectId;
  }
}
