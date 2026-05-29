import { Router } from "express";
import * as controller from "../controllers/poll-vote.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router({
  mergeParams: true,
});

router.post("/", auth(), controller.votePoll);
router.delete("/", auth(), controller.removeVote);

export default router;
