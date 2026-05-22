import { Router } from "express";
import * as controller from "../controllers/post-collaborator.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router.get("/", controller.getCollaborators);
router.post("/", auth, controller.inviteCollaborator);
router.patch("/accept", auth, controller.acceptInvitation);
router.delete("/:userId", auth, controller.removeCollaborator);

export default router;
