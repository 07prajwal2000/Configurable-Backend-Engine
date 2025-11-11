import z from "zod";
import { HttpMethod } from "../../../../db/schema";
import { ROUTE_REGEX } from "../constants";

export const requestBodySchema = z.object({
  name: z.string().min(2).max(255),
  path: z.string().min(1).regex(ROUTE_REGEX, "Must be a valid URL path"),
  method: z.enum(HttpMethod, "Must be a HTTP Method"),
  projectId: z.string().refine((v) => {
    if (z.uuidv7().safeParse(v)) {
      return true;
    } else {
      return v === "personal";
    }
  }),
  // z.uuidv7().or(z.literal("personal")),
});

export const responseSchema = z.object({
  id: z.uuidv7(),
});
