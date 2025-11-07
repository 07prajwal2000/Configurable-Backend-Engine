import z from "zod";
import { baseBlockDataSchema } from "../../baseBlock";

export const logBlockSchema = z
  .object({
    message: z.string().optional(),
    level: z.enum(["info", "warn", "error"]),
  })
  .extend(baseBlockDataSchema.shape);
