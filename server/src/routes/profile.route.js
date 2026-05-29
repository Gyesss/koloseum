import { Router } from "express";
import * as controller from "../controllers/profile.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.patch("/me", auth(), controller.updateProfile);
router.get("/:id", controller.getProfile);

export default router;
