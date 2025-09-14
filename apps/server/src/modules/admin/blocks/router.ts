import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
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
  app.post("/blocks", zValidator("json", createBlockSchema), async (c) => {
    const data = c.req.valid("json");
    const newBlock = await createBlockService(data);
    return c.json(newBlock, 201);
  });

  // GET /admin/blocks/:id – Get block by ID
  app.get("/blocks/:id", zValidator("param", getBlockByIdSchema), async (c) => {
    const id = c.req.param("id");
    const block = await getBlockByIdService(id);
    if (!block) {
      throw new HttpError(404, "Block not found");
    }
    return c.json(block);
  });

  // GET /admin/blocks – Get all blocks with pagination
  app.get(
    "/blocks",
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
    zValidator("param", getBlocksByRouteIdSchema),
    async (c) => {
      const routeId = c.req.param("routeId");
      const blocks = await getBlocksByRouteIdService(routeId);
      return c.json(blocks);
    }
  );

  // PUT /admin/blocks – Upsert block (insert or update)
  app.put("/blocks", zValidator("json", createBlockSchema), async (c) => {
    const data = c.req.valid("json");
    const upsertedBlock = await upsertBlockService(data);
    return c.json(upsertedBlock);
  });

  // DELETE /admin/blocks/:id – Delete block by ID
  app.delete(
    "/blocks/:id",
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
