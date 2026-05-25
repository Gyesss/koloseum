import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { sendInvitation } from "../controllers/invitation.controller.js";

const router = Router();

router.post("/", auth, authorize(["ADMIN"]), sendInvitation);

export default router;
