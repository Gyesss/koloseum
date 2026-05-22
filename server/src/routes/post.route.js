import { Router } from "express";

import * as controller from "../controllers/post.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

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

export default router;
