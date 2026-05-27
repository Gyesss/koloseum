import { Router } from "express";
import * as controller from "../controllers/event.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import timelineRoute from "./timeline.route.js";
import qnaRoute from "./qna.route.js";
import postRoute from "./post.route.js";

const router = Router();

router.get("/", controller.getEvents);
router.get("/:id", controller.getEventById);

router.post(
  "/",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.createEvent,
);

router.patch(
  "/:id",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.updateEvent,
);

router.delete(
  "/:id",
  auth,
  authorize(["ADMIN", "ORGANIZER"]),
  controller.deleteEvent,
);

router.use("/:eventId/timelines", timelineRoute);
router.use("/:eventId/qnas", qnaRoute);
router.use("/:eventId/posts", postRoute);

export default router;
