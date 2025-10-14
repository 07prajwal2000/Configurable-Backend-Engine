import { Context } from "hono";
import z from "zod";
import { validationErrorSchema } from "../errors/validationError";

export default function (error: any, ctx: Context) {
  if (!error.success) {
    const errorsList: z.infer<typeof validationErrorSchema> = {
      type: "validation",
      errors: [],
    };
    for (let err of error.error) {
      errorsList.errors.push({
        field: err.path[0],
        message: err.message,
      });
    }
    return ctx.json(errorsList, 400);
  }
}
