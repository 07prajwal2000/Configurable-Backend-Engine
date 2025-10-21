import { Hono } from "hono";
import {
  describeRoute,
  DescribeRouteOptions,
  resolver,
  validator,
} from "hono-openapi";
import zodErrorCallbackParser from "../../../../middlewares/zodErrorCallbackParser";
import { requestBodySchema, responseSchema } from "./dto";
import { errorSchema } from "../../../../errors/customError";
import handleRequest from "./service";
import { validationErrorSchema } from "../../../../errors/validationError";
import { generateID } from "@cbe/lib";

const openapiRouteOptions: DescribeRouteOptions = {
  description:
    "Creates a new route and returns the object with id. (set projectId=personal for personal routes)",
  operationId: "create-route",
  tags: ["Routes"],
  responses: {
    200: {
      description: "Successful",
      content: {
        "application/json": {
          schema: resolver(responseSchema),
        },
      },
    },
    400: {
      description: "Invalid data",
      content: {
        "application/json": {
          schema: resolver(validationErrorSchema),
        },
      },
    },
    409: {
      description: "duplicate name",
      content: {
        "application/json": {
          schema: resolver(errorSchema),
        },
      },
    },
  },
};

export default function (app: Hono) {
  app.post(
    "/",
    describeRoute(openapiRouteOptions),
    validator("json", requestBodySchema, zodErrorCallbackParser),
    async (ctx) => {
      const data = ctx.req.valid("json");
      const userId = generateID();
      const result = await handleRequest(userId, data);
      return ctx.json(result);
    }
  );
}
