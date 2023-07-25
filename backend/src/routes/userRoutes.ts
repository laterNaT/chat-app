import express from "express";
import {
  findUsersGet,
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
router.get("/find/:username", findUsersGet);

export default router;
