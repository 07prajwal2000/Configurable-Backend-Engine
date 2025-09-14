import type {
  Route,
  CreateRouteRequest,
  ErrorResponse,
  SuccessMessage,
  BulkOperationRequest,
  BulkOperationResponse,
} from "./types";
import { httpClient } from "./httpClient";

export const routesService = {
  async getAllRoutes(): Promise<Route[]> {
    const response = await httpClient.get("/routes");
    return response.data;
  },

  async getRouteById(id: string): Promise<Route> {
    const response = await httpClient.get(`/routes/${id}`);
    return response.data;
  },

  async createRoute(data: CreateRouteRequest): Promise<Route> {
    const response = await httpClient.post("/routes", data);
    return response.data;
  },

  async updateRoute(id: string, data: CreateRouteRequest): Promise<Route> {
    const response = await httpClient.put(`/routes/${id}`, data);
    return response.data;
  },

  async deleteRoute(id: string): Promise<SuccessMessage> {
    const response = await httpClient.delete(`/routes/${id}`);
    return response.data;
  },

  async bulkOperation(
    routeId: string,
    data: BulkOperationRequest
  ): Promise<BulkOperationResponse> {
    const response = await httpClient.post(`/routes/${routeId}/bulk`, data);
    return response.data;
  },
};
