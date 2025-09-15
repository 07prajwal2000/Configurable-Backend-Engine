import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import {
  createRouteSchema,
  getRouteByIdSchema,
  bulkOperationSchema,
} from "./dto";
import {
  createRouteService,
  getRouteByIdService,
  getAllRoutesService,
  updateRouteService,
  deleteRouteService,
  bulkOperationService,
} from "./service";
import { HttpError } from "../../../errors/httpError";

export function mapRouteEndpoints(app: Hono) {
  // POST /admin/routes – Create a new route
  app.post(
    "/routes",
    describeRoute({
      description: "Create a new route",
      responses: {
        201: {
          description: "Route created successfully",
        },
        400: {
          description: "Invalid request data",
        },
      },
    }),
    zValidator("json", createRouteSchema),
    async (c) => {
      const data = c.req.valid("json");
      const newRoute = await createRouteService(data);
      return c.json(newRoute, 201);
    }
  );

  // GET /admin/routes/:id – Get route by ID
  app.get(
    "/routes/:id",
    describeRoute({
      description: "Get route by ID",
      responses: {
        200: {
          description: "Route details",
        },
        404: {
          description: "Route not found",
        },
      },
    }),
    zValidator("param", getRouteByIdSchema),
    async (c) => {
      const id = c.req.param("id");
      const route = await getRouteByIdService(id);
      if (!route) {
        throw new HttpError(404, "Route not found");
      }
      return c.json(route);
    }
  );

  // GET /admin/routes – Get all routes
  app.get(
    "/routes",
    describeRoute({
      description: "Get all routes",
      responses: {
        200: {
          description: "List of routes",
        },
      },
    }),
    async (c) => {
      const allRoutes = await getAllRoutesService();
      return c.json(allRoutes);
    }
  );

  // PUT /admin/routes/:id – Update route by ID
  app.put(
    "/routes/:id",
    describeRoute({
      description: "Update route by ID",
      responses: {
        200: {
          description: "Route updated successfully",
        },
        404: {
          description: "Route not found",
        },
      },
    }),
    zValidator("json", createRouteSchema),
    async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const updatedRoute = await updateRouteService(id, data);
      if (!updatedRoute) {
        throw new HttpError(404, "Route not found");
      }
      return c.json(updatedRoute);
    }
  );

  // DELETE /admin/routes/:id – Delete route by ID
  app.delete(
    "/routes/:id",
    describeRoute({
      description: "Delete route by ID",
      responses: {
        200: {
          description: "Route deleted successfully",
        },
        404: {
          description: "Route not found",
        },
      },
    }),
    zValidator("param", getRouteByIdSchema),
    async (c) => {
      const id = c.req.param("id");
      const deletedRoute = await deleteRouteService(id);
      if (!deletedRoute) {
        throw new HttpError(404, "Route not found");
      }
      return c.json({ message: "Route deleted successfully" });
    }
  );

  // POST /admin/routes/:id/bulk – Bulk operations for blocks and edges
  app.post(
    "/routes/:id/bulk",
    describeRoute({
      description: "Bulk operations for blocks and edges",
      responses: {
        200: {
          description: "Bulk operation completed",
        },
        404: {
          description: "Route not found",
        },
      },
    }),
    zValidator("param", getRouteByIdSchema),
    zValidator("json", bulkOperationSchema),
    async (c) => {
      const routeId = c.req.param("id");
      const data = c.req.valid("json");

      // Verify route exists
      const route = await getRouteByIdService(routeId);
      if (!route) {
        throw new HttpError(404, "Route not found");
      }

      const result = await bulkOperationService(routeId, data);
      return c.json(result);
    }
  );
}
