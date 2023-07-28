import express from "express";
import {
  createConversation,
  fetchConversations,
} from "../controllers/conversationController";
const router = express.Router();

router.post("/create", createConversation);
router.get("/", fetchConversations);

export default router;
