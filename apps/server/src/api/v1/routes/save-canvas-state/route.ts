import { Hono } from "hono";
import {
  describeRoute,
  DescribeRouteOptions,
  resolver,
  validator,
} from "hono-openapi";
import { requestBodySchema, requestRouteSchema, responseSchema } from "./dto";
import { validationErrorSchema } from "../../../../errors/validationError";
import { errorSchema } from "../../../../errors/customError";

const openapiRouteOptions: DescribeRouteOptions = {
  description:
    "Upsert action and saves the state by taking changes and actions to perform operation",
  operationId: "save-canvas-state",
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
      description: "Invalid ID/Data format",
      content: {
        "application/json": {
          schema: resolver(validationErrorSchema),
        },
      },
    },
    404: {
      description: "Route not found",
      content: {
        "application/json": {
          schema: resolver(errorSchema),
        },
      },
    },
  },
};

export default function (app: Hono) {
  app.get(
    "/:id/save-canvas",
    describeRoute(openapiRouteOptions),
    validator("param", requestRouteSchema),
    validator("json", requestBodySchema),
    async (c) => {}
  );
}
