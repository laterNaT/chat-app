import express from "express";
import { registerPost } from "../controllers/userController";
const router = express.Router();

router.post("/register", registerPost);

export default router;
