import { Router } from "express";

import * as controller from "../controllers/qna.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router({ mergeParams: true });

router.get("/", controller.getQnasByEventId);

router.post(
  "/",
  auth(),
  authorize(["ADMIN", "ORGANIZER"]),
  controller.createQna,
);

router.patch(
  "/:qnaId",
  auth(),
  authorize(["ADMIN", "ORGANIZER"]),
  controller.updateQna,
);

router.delete(
  "/:qnaId",
  auth(),
  authorize(["ADMIN", "ORGANIZER"]),
  controller.deleteQna,
);

export default router;
