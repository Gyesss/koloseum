import { Router } from "express";
import * as controller from "../controllers/comment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import commentLikeRoute from "./comment-like.route.js";

const router = Router({
  mergeParams: true,
});

router.get("/", controller.getComments);
router.post("/", auth, controller.createComment);
router.patch("/:commentId", auth, controller.updateComment);
router.delete("/:commentId", auth, controller.deleteComment);

router.use("/:commentId/likes", commentLikeRoute);

export default router;
