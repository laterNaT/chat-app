import express from "express";
const router = express.Router();

// API routes for managing conversations
// create new conversation: POST /api/conversations/create
// get all conversations: GET /api/conversations
// send message to conversation: POST /api/conversations/:id/send
// get conversation by id: GET /api/conversations/:id

router.post("/create", conversationCreatePost);
router.get("/", getConversationsGet);
router.post("/:id/send", conversationSendPost);
router.get("/:id", getConversationByIdGet);

export default router;
