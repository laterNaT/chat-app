import express from "express";
import { loginUserPost, registerUserPost } from "../controllers/userController";
import checkLoggedIn from "../middleware/checkLoggedIn";
const router = express.Router();

router.use(checkLoggedIn);
router.post("/register", registerUserPost);
router.post("/login", loginUserPost);

export default router;
