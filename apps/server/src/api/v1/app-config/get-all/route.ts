import { Hono } from "hono";
import {
  describeRoute,
  DescribeRouteOptions,
  resolver,
  validator,
} from "hono-openapi";
import { requestQuerySchema, responseSchema } from "./dto";
import handleRequest from "./service";
import zodErrorCallbackParser from "../../../../middlewares/zodErrorCallbackParser";
import { validationErrorSchema } from "../../../../errors/validationError";

const openapiRouteOptions: DescribeRouteOptions = {
  description: "Get all app configs",
  operationId: "get-all-app-configs",
  tags: ["App Config"],
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
      description: "Pagination parameters are invalid",
      content: {
        "application/json": {
          schema: resolver(validationErrorSchema),
        },
      },
    },
  },
};

export default function (app: Hono) {
  app.get(
    "/list",
    describeRoute(openapiRouteOptions),
    validator("query", requestQuerySchema, zodErrorCallbackParser),
    async (c) => {
      const { page, perPage } = c.req.valid("query");
      const response = await handleRequest(page, perPage);
      return c.json(response);
    }
  );
}
