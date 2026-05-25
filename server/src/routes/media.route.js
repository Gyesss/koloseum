import { Router } from "express";

import { uploadPostMediaController } from "../controllers/media.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

import { uploadPostMediaMiddleware } from "../middlewares/media.middleware.js";

const router = Router();

router.post(
  "/posts/:postId",
  auth,
  uploadPostMediaMiddleware.single("media"),
  uploadPostMediaController,
);

export default router;
