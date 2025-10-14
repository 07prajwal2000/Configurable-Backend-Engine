import { Context, Hono } from "hono";
import { HttpError } from "../errors/httpError";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { CustomError } from "../errors/customError";
import { ValidationError } from "../errors/validationError";

export function errorHandler(error: any, c: Context) {
  if (error instanceof CustomError) {
    const errorType = error.getError().type;
    if (error instanceof ValidationError) {
      return c.json(
        { error, type: errorType },
        error.httpCode as ContentfulStatusCode
      );
    }
    return c.json(
      { error: error.message, type: errorType },
      error.httpCode as ContentfulStatusCode
    );
  }
  if (error.toString().includes("Malformed JSON")) {
    return c.json(
      {
        error: "Invalid JSON",
        type: "validation",
      },
      400
    );
  }
  // Handle other types of errors
  console.error("Unhandled error:", error);
  return c.json(
    { error: "Unknown server error occured", type: "server_error" },
    500
  );
}

// Helper function to create HttpError instances
export { HttpError };
