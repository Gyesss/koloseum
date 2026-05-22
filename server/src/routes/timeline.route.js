import { Router } from "express";

import * as controller from "../controllers/timeline.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router({ mergeParams: true });

router.get("/", controller.getTimelinesByEventId);

router.post(
  "/",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.createTimeline,
);

router.patch(
  "/:timelineId",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.updateTimeline,
);

router.delete(
  "/:timelineId",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.deleteTimeline,
);

export default router;
