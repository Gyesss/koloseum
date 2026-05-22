import { z } from "zod";

export const updateRoleSchema = z
  .object({
    userId: z.string().uuid(),
    role: z.enum(["ADMIN", "ORGANIZER", "MEMBER"]),
  })
  .strict();
