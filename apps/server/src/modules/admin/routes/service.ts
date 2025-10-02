import {
  createRoute,
  getRouteById,
  getAllRoutes,
  updateRoute,
  deleteRoute,
} from "./repository";
import { RouteType, BulkOperation } from "./dto";
import { generateID } from "@cbe/lib";
import { createBlockService } from "../blocks/service";
import {
  getBlockById,
  deleteBlock,
  createBlock,
  upsertBlock,
} from "../blocks/repository";
import {
  getEdgeById,
  deleteEdge,
  createEdge,
  updateEdge,
} from "../edges/repository";
import { db } from "../../../db";
import { CHAN_ON_ROUTE_CHANGE, publishMessage } from "../../../db/redis";

export async function createRouteService(data: RouteType) {
  // Generate ID if not provided
  const routeData = {
    ...data,
    id: generateID(),
  };

  const result = await createRoute(routeData);
  await createBlockService({
    routeId: result.id,
    type: "entrypoint",
    position: {
      x: 0,
      y: 0,
    },
  });
  await createBlockService({
    routeId: result.id,
    type: "response",
    position: {
      x: 0,
      y: 100,
    },
    data: {
      httpCode: "200",
    },
  });
  await publishMessage(CHAN_ON_ROUTE_CHANGE, "");
  return result;
}

export async function getRouteByIdService(id: string) {
  return await getRouteById(id);
}

export async function getAllRoutesService() {
  return await getAllRoutes();
}

export async function updateRouteService(id: string, data: RouteType) {
  await publishMessage(CHAN_ON_ROUTE_CHANGE, "");
  return await updateRoute(id, data);
}

export async function deleteRouteService(id: string) {
  await publishMessage(CHAN_ON_ROUTE_CHANGE, "");
  return await deleteRoute(id);
}

export async function bulkOperationService(
  routeId: string,
  data: BulkOperation
) {
  const { blocks, edges } = data;

  // Separate operations by type
  const blockDeletes = blocks.filter((op) => op.action === "delete");
  const blockCreatesUpdates = blocks.filter(
    (op) => op.action === "create" || op.action === "update"
  );

  const edgeDeletes = edges.filter((op) => op.action === "delete");
  const edgeCreatesUpdates = edges.filter(
    (op) => op.action === "create" || op.action === "update"
  );

  // Execute deletes first (in a transaction)
  await db.transaction(async (tx) => {
    // Delete edges first to avoid foreign key constraints
    for (const edgeOp of edgeDeletes) {
      // Check if edge exists before deleting
      const existingEdge = await getEdgeById(edgeOp.content.id, tx);
      if (existingEdge) {
        await deleteEdge(edgeOp.content.id, tx);
      }
      // Skip if edge doesn't exist (already deleted or never existed)
    }

    // Then delete blocks
    for (const blockOp of blockDeletes) {
      // Check if block exists before deleting
      const existingBlock = await getBlockById(blockOp.content.id, tx);
      if (existingBlock) {
        await deleteBlock(blockOp.content.id, tx);
      }
      // Skip if block doesn't exist (already deleted or never existed)
    }
  });

  // Execute creates/updates (in a separate transaction)
  await db.transaction(async (tx) => {
    // Create/Update blocks first
    for (const blockOp of blockCreatesUpdates) {
      if (blockOp.action === "create") {
        await createBlock(
          {
            ...blockOp.content,
            routeId,
          },
          tx
        );
      } else if (blockOp.action === "update") {
        await upsertBlock(
          {
            ...blockOp.content,
            routeId,
          },
          tx
        );
      }
    }

    // Then create/update edges
    for (const edgeOp of edgeCreatesUpdates) {
      if (edgeOp.action === "create") {
        await createEdge(edgeOp.content, tx);
      } else if (edgeOp.action === "update") {
        await updateEdge(edgeOp.content.id, edgeOp.content, tx);
      }
    }
  });
  await publishMessage(CHAN_ON_ROUTE_CHANGE, "");
  return { success: true, message: "Bulk operation completed successfully" };
}
