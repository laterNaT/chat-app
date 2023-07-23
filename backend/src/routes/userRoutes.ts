import express from "express";
import {
  loginUserPost,
  logoutUserDelete,
  registerUserPost,
} from "../controllers/userController";
import checkLoggedIn from "../middleware/checkLoggedIn";
const router = express.Router();

router.use(checkLoggedIn);
router.post("/register", registerUserPost);
router.post("/login", loginUserPost);
router.delete("/logout", logoutUserDelete);

export default router;
