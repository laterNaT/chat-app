import express from "express";
import {
  acceptFriendRequest,
  declineFriendRequest,
  fetchPendingFriendRequests,
  findUsersNotFriended,
  getUserFriends,
  sendFriendRequest,
} from "../controllers/friendController";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn";
const router = express.Router();

router.use(ensureLoggedIn);
router.post("/requests/send", sendFriendRequest);
router.post("/requests/accept", acceptFriendRequest);
router.post("/requests/decline", declineFriendRequest);
router.get("/requests/pending", fetchPendingFriendRequests);
router.get("/not-friended/:username", findUsersNotFriended);
router.get("/user", getUserFriends);

export default router;
