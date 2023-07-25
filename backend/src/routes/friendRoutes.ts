import express from "express";
import {
  friendRequestAcceptPost,
  friendRequestPost,
} from "../controllers/friendController";
const router = express.Router();

router.post("/create", friendRequestPost);
router.post("/accept", friendRequestAcceptPost);

export default router;
