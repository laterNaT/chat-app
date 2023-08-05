import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  searchUsers,
} from "../controllers/userController";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn";
import { ensureNotLoggedIn } from "../middleware/ensureNotLoggedIn";
const router = express.Router();

router.post("/register", ensureNotLoggedIn, registerUser);
router.post("/login", ensureNotLoggedIn, loginUser);
router.delete("/logout", ensureLoggedIn, logoutUser);
router.get("/search/:username", ensureLoggedIn, searchUsers);

export default router;
