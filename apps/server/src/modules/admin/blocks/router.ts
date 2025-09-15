import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import {
  createBlockSchema,
  updateBlockSchema,
  getBlockByIdSchema,
  getBlocksByRouteIdSchema,
  getAllBlocksPaginationSchema,
} from "./dto";
import {
  createBlockService,
  getBlockByIdService,
  getAllBlocksService,
  getBlocksByRouteIdService,
  upsertBlockService,
  deleteBlockService,
} from "./service";
import { HttpError } from "../../../errors/httpError";

export function mapBlockEndpoints(app: Hono) {
  // POST /admin/blocks – Create a new block
  app.post(
    "/blocks",
    describeRoute({
      description: "Create a new block",
      responses: {
        201: {
          description: "Block created successfully",
        },
        400: {
          description: "Invalid request data",
        },
      },
    }),
    zValidator("json", createBlockSchema),
    async (c) => {
      const data = c.req.valid("json");
      const newBlock = await createBlockService(data);
      return c.json(newBlock, 201);
    }
  );

  // GET /admin/blocks/:id – Get block by ID
  app.get(
    "/blocks/:id",
    describeRoute({
      description: "Get block by ID",
      responses: {
        200: {
          description: "Block details",
        },
        404: {
          description: "Block not found",
        },
      },
    }),
    zValidator("param", getBlockByIdSchema),
    async (c) => {
      const id = c.req.param("id");
      const block = await getBlockByIdService(id);
      if (!block) {
        throw new HttpError(404, "Block not found");
      }
      return c.json(block);
    }
  );

  // GET /admin/blocks – Get all blocks with pagination
  app.get(
    "/blocks",
    describeRoute({
      description: "Get all blocks with pagination",
      responses: {
        200: {
          description: "List of blocks with pagination",
        },
      },
    }),
    zValidator("query", getAllBlocksPaginationSchema),
    async (c) => {
      const { perPage, pageNumber } = c.req.valid("query");
      const result = await getAllBlocksService(perPage, pageNumber);
      return c.json(result);
    }
  );

  // GET /admin/blocks/route/:routeId – Get all blocks by route ID
  app.get(
    "/blocks/route/:routeId",
    describeRoute({
      description: "Get all blocks by route ID",
      responses: {
        200: {
          description: "List of blocks for the route",
        },
      },
    }),
    zValidator("param", getBlocksByRouteIdSchema),
    async (c) => {
      const routeId = c.req.param("routeId");
      const blocks = await getBlocksByRouteIdService(routeId);
      return c.json(blocks);
    }
  );

  // PUT /admin/blocks – Upsert block (insert or update)
  app.put(
    "/blocks",
    describeRoute({
      description: "Upsert block (create or update)",
      responses: {
        200: {
          description: "Block upserted successfully",
        },
      },
    }),
    zValidator("json", createBlockSchema),
    async (c) => {
      const data = c.req.valid("json");
      const upsertedBlock = await upsertBlockService(data);
      return c.json(upsertedBlock);
    }
  );

  // DELETE /admin/blocks/:id – Delete block by ID
  app.delete(
    "/blocks/:id",
    describeRoute({
      description: "Delete block by ID",
      responses: {
        200: {
          description: "Block deleted successfully",
        },
        404: {
          description: "Block not found",
        },
      },
    }),
    zValidator("param", getBlockByIdSchema),
    async (c) => {
      const id = c.req.param("id");
      const deletedBlock = await deleteBlockService(id);
      if (!deletedBlock) {
        throw new HttpError(404, "Block not found");
      }
      return c.json({ message: "Block deleted successfully" });
    }
  );
}
