import { z } from "zod";

export const createEventSchema = z
  .object({
    name: z.string().min(3).max(124),
    tagline: z.string().min(3).max(64),
    description: z.string().min(10),
    location: z.string().min(3),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    mood: z.string().min(7).max(7),
  })
  .strict();

export const updateEventSchema = z
  .object({
    name: z.string().min(3).max(124).optional(),
    tagline: z.string().min(3).max(64).optional(),
    description: z.string().min(10).optional(),
    location: z.string().min(3).optional(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    mood: z.string().min(7).max(7).optional(),
  })
  .strict();
