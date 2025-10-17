import { uuidv7, z } from "zod";

export const requestRouteSchema = z.object({ id: uuidv7() });

export const responseSchema = z.string();
