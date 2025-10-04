import { operatorSchema } from "@cbe/lib";
import z from "zod";

export const whereConditionSchema = z.object({
  attribute: z.string(),
  operator: operatorSchema.exclude(["js"]),
  value: z.string().or(z.number()),
  chain: z.enum(["and", "or"]),
});
