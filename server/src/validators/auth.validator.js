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
