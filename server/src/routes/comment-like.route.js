import { Router } from "express";
import * as controller from "../controllers/comment-like.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router({
  mergeParams: true,
});

router.post("/", auth(), controller.likeComment);
router.delete("/", auth(), controller.unlikeComment);

export default router;
