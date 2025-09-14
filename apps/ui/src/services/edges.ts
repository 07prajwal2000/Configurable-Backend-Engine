import { generateID } from "@cbe/lib";
import type {
  Edge,
  EdgeWithBlocks,
  CreateEdgeRequest,
  UpdateEdgeRequest,
  SuccessMessage,
} from "./types";
import { httpClient } from "./httpClient";

export const edgesService = {
  async getEdgesByRouteId(routeId: string): Promise<EdgeWithBlocks[]> {
    const response = await httpClient.get(`/edges/${routeId}`);
    return response.data;
  },

  async createEdge(data: CreateEdgeRequest): Promise<Edge> {
    const response = await httpClient.post("/edges", data);
    return response.data;
  },

  async updateEdge(id: string, data: UpdateEdgeRequest): Promise<Edge> {
    const response = await httpClient.put(`/edges/${id}`, data);
    return response.data;
  },

  async deleteEdge(id: string): Promise<SuccessMessage> {
    const response = await httpClient.delete(`/edges/${id}`);
    return response.data;
  },
};

export async function generateEdgeID(): Promise<string> {
  return generateID();
}
