import z from "zod";
import {
  requestQuerySchema as getAllRequestQuerySchema,
  responseSchema as getAllResponseSchema,
} from "@cbe/backend-engine/src/api/v1/routes/get-all/dto";
import {
  requestBodySchema as createRequestSchema,
  responseSchema as createResponseSchema,
} from "@cbe/backend-engine/src/api/v1/routes/create/dto";
import {
  requestBodySchema as updateRequestSchema,
  responseSchema as updateResponseSchema,
} from "@cbe/backend-engine/src/api/v1/routes/update/dto";
import { responseSchema as getByIdResponseSchema } from "@cbe/backend-engine/src/api/v1/routes/get-by-id/dto";
import { httpClient } from "@/lib/http";

const baseUrl = `/v1/routes`;

export type GetAllRequestType = z.infer<typeof getAllRequestQuerySchema>;
export const routesService = {
  async getAll(
    pagination: GetAllRequestType
  ): Promise<z.infer<typeof getAllResponseSchema>> {
    const { data } = getAllRequestQuerySchema.safeParse(pagination);
    const result = await httpClient.get(
      `${baseUrl}/list?page=${data?.page}&perPage=${data?.perPage}`
    );
    return result.data;
  },
  async getByID(id: string): Promise<z.infer<typeof getByIdResponseSchema>> {
    const result = await httpClient.get(`${baseUrl}/${id}`);
    return result.data;
  },
  async create(
    data: z.infer<typeof createRequestSchema>
  ): Promise<z.infer<typeof createResponseSchema>> {
    const result = await httpClient.post(`${baseUrl}`, data);
    return result.data;
  },
  async update(
    id: string,
    data: z.infer<typeof updateRequestSchema>
  ): Promise<z.infer<typeof updateResponseSchema>> {
    const result = await httpClient.put(`${baseUrl}/${id}`, data);
    return result.data;
  },
  async delete(id: string) {
    await httpClient.delete(`${baseUrl}/${id}`);
  },
  // zod schemas
  createRequestSchema,
  updateRequestSchema,
};
