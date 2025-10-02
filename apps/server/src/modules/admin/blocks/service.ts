import {
  createBlock,
  getBlockById,
  getAllBlocks,
  getTotalBlocksCount,
  getBlocksByRouteId,
  upsertBlock,
  deleteBlock,
} from "./repository";
import { getRouteById } from "../routes/repository";
import { BlockType } from "./dto";
import { generateID } from "@cbe/lib";
import { db } from "../../../db";
import { blocksEntity } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { HttpError } from "../../../errors/httpError";

export async function createBlockService(data: BlockType) {
  // Validate that the route exists if routeId is provided
  if (data.routeId) {
    const existingRoute = await getRouteById(data.routeId);
    if (!existingRoute) {
      throw new HttpError(404, `Route with ID ${data.routeId} does not exist`);
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

export async function getAllBlocksService(perPage: number, pageNumber: number) {
  const offset = (pageNumber - 1) * perPage;

  // Get paginated data and total count in parallel
  const [blocks, totalRecords] = await Promise.all([
    getAllBlocks(perPage, offset),
    getTotalBlocksCount(),
  ]);

  const totalPages = Math.ceil(totalRecords / perPage);
  const hasNextPage = pageNumber < totalPages;

  return {
    data: blocks,
    pagination: {
      currentPage: pageNumber,
      totalRecords,
      hasNextPage,
    },
  };
}

export async function getBlocksByRouteIdService(routeId: string) {
  return await getBlocksByRouteId(routeId);
}

export async function upsertBlockService(data: BlockType, tx?: any) {
  // Validate that the route exists if routeId is provided
  if (data.routeId) {
    const existingRoute = await getRouteById(data.routeId);
    if (!existingRoute) {
      throw new HttpError(404, `Route with ID ${data.routeId} does not exist`);
    }
  }

  // Generate ID if not provided
  const blockId = data.id || generateID();

  // Prepare upsert data with proper timestamps
  const upsertData: BlockType = {
    id: blockId,
    type: data.type,
    position: data.position,
    data: data.data,
    routeId: data.routeId,
    createdAt: new Date(), // Will be ignored on update due to conflict resolution
    updatedAt: new Date(), // Always update the updatedAt timestamp
  };

  return await upsertBlock(upsertData, tx);
}

export async function deleteBlockService(id: string) {
  // First, get the block to check its type and route
  const blockToDelete = await getBlockById(id);
  if (!blockToDelete) {
    throw new HttpError(404, `Block with ID ${id} not found`);
  }

  // Prevent deletion of entrypoint blocks
  if (blockToDelete.type === "entrypoint") {
    throw new HttpError(404, "Cannot delete entrypoint blocks");
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
      throw new HttpError(
        404,
        "Cannot delete the last response block for this route. At least one response block must remain."
      );
    }
  }

  return await deleteBlock(id);
}
