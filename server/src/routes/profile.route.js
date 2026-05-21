import { Router } from "express";
import * as controller from "../controllers/profile.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.put("/me", auth, controller.updateProfile);
router.get("/:username", controller.getProfile);

export default router;
