import type {
  AppConfig,
  AppConfigWithoutValue,
  CreateAppConfigRequest,
  UpdateAppConfigRequest,
  SuccessMessage,
  PaginatedAppConfigsResponse,
} from "./types";
import { httpClient } from "./httpClient";

export const appconfigService = {
  async getAllAppConfigs(
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: "keyName" | "createdAt" | "updatedAt",
    sortOrder?: "asc" | "desc"
  ): Promise<AppConfigWithoutValue[] | PaginatedAppConfigsResponse> {
    const params = new URLSearchParams();
    if (page !== undefined) {
      params.append("page", page.toString());
    }
    if (limit !== undefined) {
      params.append("limit", limit.toString());
    }
    if (search !== undefined) {
      params.append("search", search);
    }
    if (sortBy !== undefined) {
      params.append("sortBy", sortBy);
    }
    if (sortOrder !== undefined) {
      params.append("sortOrder", sortOrder);
    }

    const queryString = params.toString();
    const url = queryString ? `/appconfig?${queryString}` : "/appconfig";

    const response = await httpClient.get(url);

    // If pagination parameters are provided, return paginated response
    if (page !== undefined || limit !== undefined) {
      return response.data as PaginatedAppConfigsResponse;
    }

    // For backward compatibility, if no pagination params, return just the data array
    return response.data as AppConfigWithoutValue[];
  },

  async getAppConfigById(id: number): Promise<AppConfig> {
    const response = await httpClient.get(`/appconfig/${id}`);
    return response.data;
  },

  async listConfigNames() {
    const response = await httpClient("/appconfig/view-list");
    return response.data as string[];
  },

  async createAppConfig(data: CreateAppConfigRequest): Promise<AppConfig> {
    const response = await httpClient.post("/appconfig", data);
    return response.data;
  },

  async updateAppConfig(
    id: number,
    data: UpdateAppConfigRequest
  ): Promise<AppConfig> {
    const response = await httpClient.put(`/appconfig/${id}`, data);
    return response.data;
  },

  async deleteAppConfig(id: number): Promise<SuccessMessage> {
    const response = await httpClient.delete(`/appconfig/${id}`);
    return response.data;
  },
};
