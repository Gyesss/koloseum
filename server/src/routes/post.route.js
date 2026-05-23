import { Router } from "express";
import * as controller from "../controllers/post.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import postCollaboratorRoute from "./post-collaborator.route.js";
import postLikeRoute from "./post-like.route.js";
import commentRoute from "./comment.route.js";
import pollRoute from "./poll.route.js";

const router = Router({ mergeParams: true });

router.get("/", controller.getPostsByEventId);

router.get("/:postId", controller.getPostById);

router.post(
  "/",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.createPost,
);

router.patch(
  "/:postId",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.updatePost,
);

router.delete(
  "/:postId",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.deletePost,
);

router.use("/:postId/collaborators", postCollaboratorRoute);
router.use("/:postId/likes", postLikeRoute);
router.use("/:postId/comments", commentRoute);
router.use("/:postId/poll", pollRoute);

export default router;
