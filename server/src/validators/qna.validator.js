import { z } from "zod";

export const createQnaSchema = z
  .object({
    question: z.string().min(1).max(10000),

    answer: z.string().min(1).max(10000),
  })
  .strict();

export const updateQnaSchema = z
  .object({
    question: z.string().min(1).max(10000).optional(),

    answer: z.string().min(1).max(10000).optional(),
  })
  .strict();
