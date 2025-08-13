import z from "zod";

export const logBlockSchema = z
	.object({
		message: z.string(),
		level: z.enum(["info", "warn", "error"]),
	})
	.or(z.string());
