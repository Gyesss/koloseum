import { Router } from "express";
import * as controller from "../controllers/admin.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.patch("/role", auth, authorize(["ADMIN"]), controller.updateUserRole);

export default router;
