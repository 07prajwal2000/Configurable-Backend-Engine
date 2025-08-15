import z from "zod";

export const logBlockSchema = z.object({
	message: z.string().optional(),
	level: z.enum(["info", "warn", "error"]),
});
