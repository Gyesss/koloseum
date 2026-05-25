import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { uploadPostMediaMiddleware } from "../middlewares/media.middleware.js";
import {
  uploadUserAvatarController,
  uploadUserBannerController,
  uploadEventBannerController,
  uploadPostMediaController,
} from "../controllers/media.controller.js";

const router = Router();

router.post(
  "/post/:postId",
  auth,
  uploadPostMediaMiddleware.single("media"),
  uploadPostMediaController,
);

router.post(
  "/user/avatar",
  auth,
  uploadPostMediaMiddleware.single("media"),
  uploadUserAvatarController,
);

router.post(
  "/user/banner",
  auth,
  uploadPostMediaMiddleware.single("media"),
  uploadUserBannerController,
);

router.post(
  "/event/:eventId/banner",
  auth,
  uploadPostMediaMiddleware.single("media"),
  uploadEventBannerController,
);

export default router;
