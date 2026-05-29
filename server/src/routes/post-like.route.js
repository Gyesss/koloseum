import { Router } from "express";
import * as controller from "../controllers/post-like.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router({
  mergeParams: true,
});

router.post("/", auth(), controller.likePost);
router.delete("/", auth(), controller.unlikePost);

export default router;
