import { Router } from "express";
import * as controller from "../controllers/poll.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router({
  mergeParams: true,
});

router.get("/", controller.getPoll);
router.post("/", auth, controller.createPoll);
router.delete("/", auth, controller.deletePoll);

export default router;
