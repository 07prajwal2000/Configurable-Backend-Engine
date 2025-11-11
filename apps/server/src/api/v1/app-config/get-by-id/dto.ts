import { z } from "zod";

export const requestRouteSchema = z.object({
  id: z.coerce.number().min(1).int(),
});

export const responseSchema = z.object({
  id: z.number(),
  keyName: z.string(),
  description: z.string(),
  value: z.string(),
  isEncrypted: z.boolean(),
  encodingType: z.enum(["plaintext", "base64", "hex"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
