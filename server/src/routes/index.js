import { Router } from "express";

import authRoute from "./auth.route.js";
import adminRoute from "./admin.route.js";
import profileRoute from "./profile.route.js";
import eventRoute from "./event.route.js";
import notificationRoute from "./notification.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/admin", adminRoute);
router.use("/profile", profileRoute);
router.use("/events", eventRoute);
router.use("/notifications", notificationRoute);

export default router;

// NOTE: Untuk sekarang, Role tersimpan di Payload JWT sehingga ketika seorang user update role, harus relog untuk mendapatkan perubahan
