import { z } from "zod";

export const inviteCollaboratorSchema = z
  .object({
    userId: z.uuid(),
  })
  .strict();
