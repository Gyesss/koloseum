import { z } from "zod";

export const createPostSchema = z
  .object({
    title: z.string().min(3).max(124),

    caption: z.string().max(10000).optional(),

    postType: z.enum(["ANNOUNCEMENT", "PROJECT", "REWARD"]).optional(),

    isFeatured: z.boolean().optional(),

    startAt: z.coerce.date().optional(),

    endAt: z.coerce.date().optional(),
  })
  .strict();

export const updatePostSchema = z
  .object({
    title: z.string().min(3).max(124).optional(),

    caption: z.string().max(10000).optional(),

    postType: z.enum(["ANNOUNCEMENT", "PROJECT", "REWARD"]).optional(),

    isFeatured: z.boolean().optional(),

    startAt: z.coerce.date().optional(),

    endAt: z.coerce.date().optional(),
  })
  .strict();
