import express from "express";
import { loginUserPost, registerUserPost } from "../controllers/userController";
const router = express.Router();

router.post("/register", registerUserPost);
router.post("/login", loginUserPost);

export default router;
