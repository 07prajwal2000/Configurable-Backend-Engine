import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  createEdgeSchema,
  updateEdgeSchema,
  getEdgeByIdSchema,
  getEdgesByRouteIdSchema,
} from "./dto";
import {
  createEdgeService,
  getEdgeByIdService,
  getEdgesByRouteIdService,
  updateEdgeService,
  deleteEdgeService,
} from "./service";

export function mapEdgeEndpoints(app: Hono) {
  // POST /admin/edges – Create a new edge
  app.post("/edges", zValidator("json", createEdgeSchema), async (c) => {
    try {
      const data = c.req.valid("json");
      const newEdge = await createEdgeService(data);
      return c.json(newEdge, 201);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to create edge" }, 400);
    }
  });

  // GET /admin/edges/:routeId – Get all edges by routeId
  app.get(
    "/edges/:routeId",
    zValidator("param", getEdgesByRouteIdSchema),
    async (c) => {
      try {
        const routeId = c.req.param("routeId");
        const edges = await getEdgesByRouteIdService(routeId);
        return c.json(edges);
      } catch (error: any) {
        return c.json(
          { error: error.message || "Failed to get edges by route ID" },
          400
        );
      }
    }
  );

  // PUT /admin/edges/:id – Update edge by ID
  app.put("/edges/:id", zValidator("json", updateEdgeSchema), async (c) => {
    try {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const updatedEdge = await updateEdgeService(id, data);
      if (!updatedEdge) {
        return c.json({ error: "Edge not found" }, 404);
      }
      return c.json(updatedEdge);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to update edge" }, 400);
    }
  });

  // DELETE /admin/edges/:id – Delete edge by ID
  app.delete(
    "/edges/:id",
    zValidator("param", getEdgeByIdSchema),
    async (c) => {
      try {
        const id = c.req.param("id");
        const deletedEdge = await deleteEdgeService(id);
        if (!deletedEdge) {
          return c.json({ error: "Edge not found" }, 404);
        }
        return c.json({ message: "Edge deleted successfully" });
      } catch (error: any) {
        return c.json({ error: error.message || "Failed to delete edge" }, 400);
      }
    }
  );
}
