import express from "express";
import {
  friendRequestAcceptPost,
  friendRequestPost,
  getFriendRequestsGet,
} from "../controllers/friendController";
const router = express.Router();

router.post("/create", friendRequestPost);
router.post("/accept", friendRequestAcceptPost);
router.get("/friends", getFriendRequestsGet);

export default router;
