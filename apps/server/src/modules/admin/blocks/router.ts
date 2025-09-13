import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  createBlockSchema,
  updateBlockSchema,
  getBlockByIdSchema,
  getBlockByPathSchema,
} from "./dto";
import {
  createBlockService,
  getBlockByIdService,
  getBlockByPathService,
  getAllBlocksService,
  updateBlockService,
  deleteBlockService,
} from "./service";

export function mapBlockEndpoints(app: Hono) {
  // POST /admin/blocks – Create a new block
  app.post("/blocks", zValidator("json", createBlockSchema), async (c) => {
    try {
      const data = c.req.valid("json");
      const newBlock = await createBlockService(data);
      return c.json(newBlock, 201);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to create block" }, 400);
    }
  });

  // GET /admin/blocks/:id – Get block by ID
  app.get("/blocks/:id", zValidator("param", getBlockByIdSchema), async (c) => {
    try {
      const id = c.req.param("id");
      const block = await getBlockByIdService(id);
      if (!block) {
        return c.json({ error: "Block not found" }, 404);
      }
      return c.json(block);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to get block" }, 400);
    }
  });

  // GET /admin/blocks/path/:path – Get block by path
  app.get(
    "/blocks/path/:path",
    zValidator("param", getBlockByPathSchema),
    async (c) => {
      try {
        const path = c.req.param("path");
        const block = await getBlockByPathService(path);
        if (!block) {
          return c.json({ error: "Block not found" }, 404);
        }
        return c.json(block);
      } catch (error: any) {
        return c.json(
          { error: error.message || "Failed to get block by path" },
          400
        );
      }
    }
  );

  // GET /admin/blocks – Get all blocks
  app.get("/blocks", async (c) => {
    try {
      const allBlocks = await getAllBlocksService();
      return c.json(allBlocks);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to get blocks" }, 400);
    }
  });

  // PUT /admin/blocks/:id – Update block by ID
  app.put("/blocks/:id", zValidator("json", updateBlockSchema), async (c) => {
    try {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const updatedBlock = await updateBlockService(id, data);
      if (!updatedBlock) {
        return c.json({ error: "Block not found" }, 404);
      }
      return c.json(updatedBlock);
    } catch (error: any) {
      return c.json({ error: error.message || "Failed to update block" }, 400);
    }
  });

  // DELETE /admin/blocks/:id – Delete block by ID
  app.delete(
    "/blocks/:id",
    zValidator("param", getBlockByIdSchema),
    async (c) => {
      try {
        const id = c.req.param("id");
        const deletedBlock = await deleteBlockService(id);
        if (!deletedBlock) {
          return c.json({ error: "Block not found" }, 404);
        }
        return c.json({ message: "Block deleted successfully" });
      } catch (error: any) {
        return c.json(
          { error: error.message || "Failed to delete block" },
          400
        );
      }
    }
  );
}
