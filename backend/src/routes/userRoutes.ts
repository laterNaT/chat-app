import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  searchUsers,
} from "../controllers/userController";
import checkLoggedIn from "../middleware/checkLoggedIn";
const router = express.Router();

router.use(checkLoggedIn);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);
router.get("/search/:username", searchUsers);

export default router;
