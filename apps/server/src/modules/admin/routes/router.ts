import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
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
  app.post("/routes", zValidator("json", createRouteSchema), async (c) => {
    const data = c.req.valid("json");
    const newRoute = await createRouteService(data);
    return c.json(newRoute, 201);
  });

  // GET /admin/routes/:id – Get route by ID
  app.get("/routes/:id", zValidator("param", getRouteByIdSchema), async (c) => {
    const id = c.req.param("id");
    const route = await getRouteByIdService(id);
    if (!route) {
      throw new HttpError(404, "Route not found");
    }
    return c.json(route);
  });

  // GET /admin/routes – Get all routes
  app.get("/routes", async (c) => {
    const allRoutes = await getAllRoutesService();
    return c.json(allRoutes);
  });

  // PUT /admin/routes/:id – Update route by ID
  app.put("/routes/:id", zValidator("json", createRouteSchema), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const updatedRoute = await updateRouteService(id, data);
    if (!updatedRoute) {
      throw new HttpError(404, "Route not found");
    }
    return c.json(updatedRoute);
  });

  // DELETE /admin/routes/:id – Delete route by ID
  app.delete(
    "/routes/:id",
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
