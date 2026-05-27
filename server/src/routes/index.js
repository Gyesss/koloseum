import { Router } from "express";

import authRoute from "./auth.route.js";
import adminRoute from "./admin.route.js";
import profileRoute from "./profile.route.js";
import eventRoute from "./event.route.js";
import notificationRoute from "./notification.route.js";
import mediaRoute from "./media.route.js";
import invitationRoute from "./invitation.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/admin", adminRoute);
router.use("/profile", profileRoute);
router.use("/events", eventRoute);
router.use("/notifications", notificationRoute);
router.use("/media", mediaRoute);
router.use("/invitation", invitationRoute);

export default router;

// NOTE: JWT menyimpan User Payload dan jika ada auth row(s) yang berubah, payload baru dibutuhkan.
