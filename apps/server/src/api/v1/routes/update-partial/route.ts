import { Hono } from "hono";
import {
  describeRoute,
  DescribeRouteOptions,
  resolver,
  validator,
} from "hono-openapi";
import { requestBodySchema, responseSchema } from "./dto";
import handleRequest from "./service";
import { requestRouteSchema } from "../get-by-id/dto";
import zodErrorCallbackParser from "../../../../middlewares/zodErrorCallbackParser";
import { errorSchema } from "../../../../errors/customError";

const openapiRouteOptions: DescribeRouteOptions = {
  description: "Does partial update of the route",
  operationId: "partial-update-route",
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
      description: "Not found",
      content: {
        "application/json": {
          schema: resolver(errorSchema),
        },
      },
    },
    409: {
      description: "Conflict",
      content: {
        "application/json": {
          schema: resolver(errorSchema),
        },
      },
    },
  },
};

export default function (app: Hono) {
  app.put(
    "/partial/:id",
    describeRoute(openapiRouteOptions),
    validator("param", requestRouteSchema, zodErrorCallbackParser),
    validator("json", requestBodySchema, zodErrorCallbackParser),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      const result = await handleRequest(id, data);
      return c.json(result);
    }
  );
}
