import { generateID } from "@cbe/lib";
import type {
  Block,
  CreateBlockRequest,
  UpdateBlockRequest,
  ErrorResponse,
  SuccessMessage,
} from "./types";
import { httpClient } from "./httpClient";

export const blocksService = {
  async getAllBlocks(): Promise<Block[]> {
    const response = await httpClient.get("/blocks");
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

  async deleteBlock(id: string): Promise<SuccessMessage> {
    const response = await httpClient.delete(`/blocks/${id}`);
    return response.data;
  },
};

export async function generateBlockID(): Promise<string> {
  return generateID();
}
