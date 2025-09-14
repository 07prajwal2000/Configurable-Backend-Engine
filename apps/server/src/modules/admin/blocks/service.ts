import {
  createBlock,
  getBlockById,
  getAllBlocks,
  updateBlock,
  deleteBlock,
} from "./repository";
import { getRouteById } from "../routes/repository";
import { BlockType } from "./dto";
import { generateID } from "@cbe/lib";
import { db } from "../../../db";
import { blocksEntity } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export async function createBlockService(data: BlockType) {
  // Validate that the route exists if routeId is provided
  if (data.routeId) {
    const existingRoute = await getRouteById(data.routeId);
    if (!existingRoute) {
      throw new Error(`Route with ID ${data.routeId} does not exist`);
    }
  }

  // Generate ID if not provided
  const blockData = {
    ...data,
    id: data.id || generateID(),
  };

  return await createBlock(blockData);
}

export async function getBlockByIdService(id: string) {
  return await getBlockById(id);
}

export async function getAllBlocksService() {
  return await getAllBlocks();
}

export async function updateBlockService(id: string, data: Partial<BlockType>) {
  // Get the existing block to preserve routeId and other required fields
  const existingBlock = await getBlockById(id);
  if (!existingBlock) {
    return null;
  }

  // Merge the update data with existing block data, preserving routeId
  const updateData: BlockType = {
    id: existingBlock.id,
    type: data.type ?? (existingBlock.type as string),
    position:
      data.position ?? (existingBlock.position as { x: number; y: number }),
    data: data.data ?? existingBlock.data,
    createdAt: existingBlock.createdAt,
    updatedAt: new Date(),
    routeId: existingBlock.routeId as string,
  };

  return await updateBlock(id, updateData);
}

export async function deleteBlockService(id: string) {
  // First, get the block to check its type and route
  const blockToDelete = await getBlockById(id);
  if (!blockToDelete) {
    throw new Error(`Block with ID ${id} not found`);
  }

  // Prevent deletion of entrypoint blocks
  if (blockToDelete.type === "entrypoint") {
    throw new Error("Cannot delete entrypoint blocks");
  }

  // If this is a response block, ensure at least one response block remains for the route
  if (blockToDelete.type === "response" && blockToDelete.routeId) {
    const responseBlocksForRoute = await db
      .select()
      .from(blocksEntity)
      .where(
        and(
          eq(blocksEntity.routeId, blockToDelete.routeId),
          eq(blocksEntity.type, "response")
        )
      );

    // If this is the only response block for the route, prevent deletion
    if (responseBlocksForRoute.length <= 1) {
      throw new Error(
        "Cannot delete the last response block for this route. At least one response block must remain."
      );
    }
  }

  return await deleteBlock(id);
}
