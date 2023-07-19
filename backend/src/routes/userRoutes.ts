import express from "express";
import { registerUserPost } from "../controllers/userController";
const router = express.Router();

router.post("/register", registerUserPost);

export default router;
