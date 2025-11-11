import { z } from "zod";
import {
  paginationRequestQuerySchema,
  paginationResponseSchema,
} from "../../../../lib/pagination";

export const requestQuerySchema = paginationRequestQuerySchema;

export const responseSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      keyName: z.string(),
      description: z.string(),
      value: z.string(),
      isEncrypted: z.boolean(),
      encodingType: z.enum(["plaintext", "base64", "hex"]),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
  pagination: paginationResponseSchema,
});

// id: number;
// keyName: string;
// description: string;
// value: string;
// isEncrypted: boolean;
// encodingType: string;
// createdAt: string;
// updatedAt: string;
