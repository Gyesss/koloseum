import { z } from "zod";

export const createTimelineSchema = z
  .object({
    name: z.string().min(3).max(124),

    additional: z.string().max(5000).optional(),

    type: z.enum([
      "CEREMONIAL",
      "OPENING",
      "MC",
      "SHOW",
      "CONTEST",
      "ICE_BREAKING",
      "BREAKS",
      "CLOSING",
      "OTHER",
    ]),

    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
  })
  .strict();

export const updateTimelineSchema = z
  .object({
    name: z.string().min(3).max(124).optional(),

    additional: z.string().max(5000).optional(),

    type: z
      .enum([
        "CEREMONIAL",
        "OPENING",
        "MC",
        "SHOW",
        "CONTEST",
        "ICE_BREAKING",
        "BREAKS",
        "CLOSING",
        "OTHER",
      ])
      .optional(),

    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
  })
  .strict();
