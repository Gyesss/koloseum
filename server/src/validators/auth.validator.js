import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(32)
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only be lowercase letters, numbers and underscores",
      ),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    fullName: z
      .string()
      .min(3)
      .max(124)
      .regex(/^[A-Za-z\s.'-]+$/, "Full name contains invalid characters"),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP must be 6 digits"),
  })
  .strict();

export const resendOtpSchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6).max(100),
  })
  .strict();

export const deleteAccountSchema = z
  .object({
    password: z.string().min(6).max(100),
    adminPassword: z.string().optional(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6).max(100),
    newPassword: z.string().min(6).max(100),
  })
  .strict();

export const changeEmailSchema = z
  .object({
    newEmail: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();
