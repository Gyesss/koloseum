import { z } from "zod";

export const createPollSchema = z
  .object({
    question: z.string().min(1).max(500),

    maxChoices: z.number().int().positive(),

    options: z.array(z.string().min(1).max(255)).min(2).max(20),
  })
  .strict()
  .superRefine((data, ctx) => {
    const uniqueOptions = new Set(
      data.options.map((option) => option.trim().toLowerCase()),
    );

    if (uniqueOptions.size !== data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Poll options must be unique",
      });
    }

    if (data.maxChoices > data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxChoices"],
        message: "maxChoices cannot exceed total options",
      });
    }
  });

export const votePollSchema = z
  .object({
    optionIds: z.array(z.string().uuid()).min(1).max(20),
  })
  .strict()
  .superRefine((data, ctx) => {
    const uniqueIds = new Set(data.optionIds);

    if (uniqueIds.size !== data.optionIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["optionIds"],
        message: "Duplicate option ids are not allowed",
      });
    }
  });
