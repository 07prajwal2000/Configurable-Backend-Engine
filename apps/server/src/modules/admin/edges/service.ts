import {
  createEdge,
  getEdgeById,
  getEdgesByRouteId,
  updateEdge,
  deleteEdge,
  getBlockById,
} from "./repository";
import { EdgeType } from "./dto";
import { generateID } from "@fluxify/lib";
import { HttpError } from "../../../errors/httpError";

// Validation function for edge data
async function validateEdgeData(from: string, to: string): Promise<void> {
  // Validate that 'from' and 'to' are not the same
  if (from === to) {
    throw new HttpError(404, "'from' and 'to' fields cannot be the same");
  }

  // Validate that both 'from' and 'to' blocks exist in the database
  const fromBlock = await getBlockById(from);
  if (!fromBlock) {
    throw new HttpError(404, `Block with ID ${from} does not exist`);
  }

  const toBlock = await getBlockById(to);
  if (!toBlock) {
    throw new HttpError(404, `Block with ID ${to} does not exist`);
  }
}

export async function createEdgeService(data: EdgeType) {
  // Validate edge data
  await validateEdgeData(data.from, data.to);

  // Generate ID if not provided
  const edgeData = {
    ...data,
    id: data.id || generateID(),
  };

  return await createEdge(edgeData);
}

export async function getEdgeByIdService(id: string) {
  return await getEdgeById(id);
}

export async function getEdgesByRouteIdService(routeId: string) {
  return await getEdgesByRouteId(routeId);
}

export async function updateEdgeService(id: string, data: Partial<EdgeType>) {
  // Get the existing edge to validate against
  const existingEdge = await getEdgeById(id);
  if (!existingEdge) {
    throw new HttpError(404, `Edge with ID ${id} not found`);
  }

  // Prepare the update data
  const updateData: EdgeType = {
    id: existingEdge.id,
    from: data.from ?? (existingEdge.from as string),
    to: data.to ?? (existingEdge.to as string),
    fromHandle: data.fromHandle ?? existingEdge.fromHandle!,
    toHandle: data.toHandle ?? existingEdge.toHandle!,
  };

  // Validate edge data
  await validateEdgeData(updateData.from, updateData.to);

  return await updateEdge(id, updateData);
}

export async function deleteEdgeService(id: string) {
  const edgeToDelete = await getEdgeById(id);
  if (!edgeToDelete) {
    throw new HttpError(404, `Edge with ID ${id} not found`);
  }

  return await deleteEdge(id);
}
