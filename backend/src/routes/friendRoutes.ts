import express from "express";
import { friendRequestPost } from "../controllers/friendController";
const router = express.Router();

router.post("/create", friendRequestPost);

export default router;
