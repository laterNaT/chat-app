import express from "express";
import {
  friendRequestAcceptPost,
  friendRequestDeclinePost,
  friendRequestPost,
  getFriendRequestsGet,
} from "../controllers/friendController";
const router = express.Router();

router.post("/create", friendRequestPost);
router.post("/accept", friendRequestAcceptPost);
router.post("/decline", friendRequestDeclinePost);
router.get("/friends", getFriendRequestsGet);

export default router;
