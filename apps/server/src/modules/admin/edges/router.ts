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
  getEdgesByRouteIdService,
  updateEdgeService,
  deleteEdgeService,
} from "./service";
import { HttpError } from "../../../errors/httpError";

export function mapEdgeEndpoints(app: Hono) {
  // POST /admin/edges – Create a new edge
  app.post("/edges", zValidator("json", createEdgeSchema), async (c) => {
    const data = c.req.valid("json");
    const newEdge = await createEdgeService(data);
    return c.json(newEdge, 201);
  });

  // GET /admin/edges/:routeId – Get all edges by routeId
  app.get(
    "/edges/:routeId",
    zValidator("param", getEdgesByRouteIdSchema),
    async (c) => {
      const routeId = c.req.param("routeId");
      const edges = await getEdgesByRouteIdService(routeId);
      return c.json(edges);
    }
  );

  // PUT /admin/edges/:id – Update edge by ID
  app.put("/edges/:id", zValidator("json", updateEdgeSchema), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const updatedEdge = await updateEdgeService(id, data);
    if (!updatedEdge) {
      throw new HttpError(404, "Edge not found");
    }
    return c.json(updatedEdge);
  });

  // DELETE /admin/edges/:id – Delete edge by ID
  app.delete(
    "/edges/:id",
    zValidator("param", getEdgeByIdSchema),
    async (c) => {
      const id = c.req.param("id");
      const deletedEdge = await deleteEdgeService(id);
      if (!deletedEdge) {
        throw new HttpError(404, "Edge not found");
      }
      return c.json({ message: "Edge deleted successfully" });
    }
  );
}
