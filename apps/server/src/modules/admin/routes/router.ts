import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createRouteSchema, getRouteByIdSchema } from "./dto";
import {
  createRouteService,
  getRouteByIdService,
  getAllRoutesService,
  updateRouteService,
  deleteRouteService,
} from "./service";

export function mapRouteEndpoints(app: Hono) {
  // POST /admin/routes – Create a new route
  app.post("/routes", zValidator("json", createRouteSchema), async (c) => {
    try {
      const data = c.req.valid("json");
      const newRoute = await createRouteService(data);
      return c.json(newRoute, 201);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to create route" }, 400);
    }
  });

  // GET /admin/routes/:id – Get route by ID
  app.get("/routes/:id", zValidator("param", getRouteByIdSchema), async (c) => {
    try {
      const id = c.req.param("id");
      const route = await getRouteByIdService(id);
      if (!route) {
        return c.json({ error: "Route not found" }, 404);
      }
      return c.json(route);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to get route" }, 400);
    }
  });

  // GET /admin/routes – Get all routes
  app.get("/routes", async (c) => {
    try {
      const allRoutes = await getAllRoutesService();
      return c.json(allRoutes);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to get routes" }, 400);
    }
  });

  // PUT /admin/routes/:id – Update route by ID
  app.put("/routes/:id", zValidator("json", createRouteSchema), async (c) => {
    try {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const updatedRoute = await updateRouteService(id, data);
      if (!updatedRoute) {
        return c.json({ error: "Route not found" }, 404);
      }
      return c.json(updatedRoute);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to update route" }, 400);
    }
  });

  // DELETE /admin/routes/:id – Delete route by ID
  app.delete(
    "/routes/:id",
    zValidator("param", getRouteByIdSchema),
    async (c) => {
      try {
        const id = c.req.param("id");
        const deletedRoute = await deleteRouteService(id);
        if (!deletedRoute) {
          return c.json({ error: "Route not found" }, 404);
        }
        return c.json({ message: "Route deleted successfully" });
      } catch (error: any) {
        return c.json(
          { error: error.message || "Failed to delete route" },
          400
        );
      }
    }
  );
}
