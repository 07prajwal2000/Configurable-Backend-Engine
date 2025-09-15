import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
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
  app.post(
    "/edges",
    describeRoute({
      description: "Create a new edge",
      responses: {
        201: {
          description: "Edge created successfully",
        },
        400: {
          description: "Invalid request data",
        },
      },
    }),
    zValidator("json", createEdgeSchema),
    async (c) => {
      const data = c.req.valid("json");
      const newEdge = await createEdgeService(data);
      return c.json(newEdge, 201);
    }
  );

  // GET /admin/edges/:routeId – Get all edges by routeId
  app.get(
    "/edges/:routeId",
    describeRoute({
      description: "Get all edges by route ID",
      responses: {
        200: {
          description: "List of edges for the route",
        },
      },
    }),
    zValidator("param", getEdgesByRouteIdSchema),
    async (c) => {
      const routeId = c.req.param("routeId");
      const edges = await getEdgesByRouteIdService(routeId);
      return c.json(edges);
    }
  );

  // PUT /admin/edges/:id – Update edge by ID
  app.put(
    "/edges/:id",
    describeRoute({
      description: "Update edge by ID",
      responses: {
        200: {
          description: "Edge updated successfully",
        },
        404: {
          description: "Edge not found",
        },
      },
    }),
    zValidator("json", updateEdgeSchema),
    async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const updatedEdge = await updateEdgeService(id, data);
      if (!updatedEdge) {
        throw new HttpError(404, "Edge not found");
      }
      return c.json(updatedEdge);
    }
  );

  // DELETE /admin/edges/:id – Delete edge by ID
  app.delete(
    "/edges/:id",
    describeRoute({
      description: "Delete edge by ID",
      responses: {
        200: {
          description: "Edge deleted successfully",
        },
        404: {
          description: "Edge not found",
        },
      },
    }),
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
