import { z } from "zod";

export const updateProfileScheme = z
  .object({
    username: z
      .string()
      .min(3)
      .max(32)
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only be lowercase letters, numbers and underscores",
      )
      .optional(),
    email: z.string().email().optional(),
    fullName: z
      .string()
      .min(3)
      .max(124)
      .regex(/^[A-Za-z\s.'-]+$/, "Full name contains invalid characters")
      .optional(),
    bio: z.string().max(1000).optional(),
    phone: z.string().max(32).optional(),
    address: z.string().max(1000).optional(),
    birthDay: z.coerce.date().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
  })
  .strict();
