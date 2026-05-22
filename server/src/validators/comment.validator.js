import { z } from "zod";

export const createCommentSchema = z
  .object({
    content: z.string().min(1).max(5000),
  })
  .strict();

export const updateCommentSchema = z
  .object({
    content: z.string().min(1).max(5000),
  })
  .strict();
