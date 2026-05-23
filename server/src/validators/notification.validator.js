import { z } from "zod";

export const getNotificationsSchema = z
  .object({
    page: z.coerce.number().min(1).optional(),

    limit: z.coerce.number().min(1).max(100).optional(),

    unread: z.coerce.boolean().optional(),
  })
  .strict();

export const createNotificationSchema = z
  .object({
    userId: z.string().uuid(),

    title: z.string().min(1).max(124),

    content: z.string().min(1).max(5000),

    type: z.enum([
      "SYSTEM",
      "EVENT",
      "POST",
      "COMMENT",
      "LIKE",
      "POLL",
      "ANNOUNCEMENT",
      "OTHER",
    ]),
  })
  .strict();
