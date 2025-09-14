import { generateID } from "@cbe/lib";
import type {
  Block,
  CreateBlockRequest,
  UpdateBlockRequest,
  SuccessMessage,
  PaginatedBlocksResponse,
} from "./types";
import { httpClient } from "./httpClient";

export const blocksService = {
  async getAllBlocks(
    perPage?: number,
    pageNumber?: number
  ): Promise<Block[] | PaginatedBlocksResponse> {
    const params = new URLSearchParams();
    if (perPage !== undefined) {
      params.append("perPage", perPage.toString());
    }
    if (pageNumber !== undefined) {
      params.append("pageNumber", pageNumber.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/blocks?${queryString}` : "/blocks";

    const response = await httpClient.get(url);

    // If pagination parameters are provided, return paginated response
    if (perPage !== undefined || pageNumber !== undefined) {
      return response.data as PaginatedBlocksResponse;
    }

    // For backward compatibility, if no pagination params, return just the data array
    return response.data as Block[];
  },

  async getBlocksByRouteId(routeId: string): Promise<Block[]> {
    const response = await httpClient.get(`/blocks/route/${routeId}`);
    return response.data;
  },

  async getBlockById(id: string): Promise<Block> {
    const response = await httpClient.get(`/blocks/${id}`);
    return response.data;
  },

  async createBlock(data: CreateBlockRequest): Promise<Block> {
    const response = await httpClient.post("/blocks", data);
    return response.data;
  },

  async updateBlock(id: string, data: UpdateBlockRequest): Promise<Block> {
    const response = await httpClient.put(`/blocks/${id}`, data);
    return response.data;
  },

  async upsertBlock(data: CreateBlockRequest): Promise<Block> {
    const response = await httpClient.put("/blocks/" + data.id, data);
    return response.data;
  },

  async deleteBlock(id: string): Promise<SuccessMessage> {
    const response = await httpClient.delete(`/blocks/${id}`);
    return response.data;
  },
};

export async function generateBlockID(): Promise<string> {
  return generateID();
}
