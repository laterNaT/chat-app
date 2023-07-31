import "express-session";
import { Session, SessionData } from "express-session";
import mongoose from "mongoose";

declare module "express-session" {
  export interface SessionData {
    isAuthorized: boolean;
    userId: mongoose.Types.ObjectId;
  }
}

declare module "http" {
  export interface IncomingMessage {
    session: Session & SessionData;
  }
}
