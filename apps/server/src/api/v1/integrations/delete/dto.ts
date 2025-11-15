import { z } from "zod";

export const requestRouteSchema = z.object({
  id: z.uuidv7(),
});
