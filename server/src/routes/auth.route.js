import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", auth(), controller.me);

router.post("/verify-email", controller.verifyEmail);
router.post("/resend-otp", controller.resendVerifyOtp);
router.post("/resend-reset-otp", controller.resendResetOtp);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

export default router;
