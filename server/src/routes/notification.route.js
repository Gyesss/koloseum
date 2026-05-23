import { Router } from "express";
import * as controller from "../controllers/notification.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(auth);

router.get("/", controller.getNotifications);
router.post("/", controller.createNotification);
router.patch("/read-all", controller.markAllAsRead);
router.patch("/:id/read", controller.markAsRead);
router.delete("/:id", controller.deleteNotification);

export default router;
