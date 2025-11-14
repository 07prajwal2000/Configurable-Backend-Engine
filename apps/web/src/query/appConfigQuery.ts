import { appConfigService } from "@/services/appConfig";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

type GetAllAppConfigQueryParams = z.infer<
  typeof appConfigService.getAllRequestQuerySchema
>;
type CreateAppConfigBodyParams = z.infer<
  typeof appConfigService.createRequestBodySchema
>;
type UpdateAppConfigBodyParams = z.infer<
  typeof appConfigService.updateRequestBodySchema
>;

export const appConfigQuery = {
  getAll: {
    useQuery(query: GetAllAppConfigQueryParams) {
      return useQuery({
        queryKey: ["app-config", "list", query],
        queryFn: () => appConfigService.getAll(query),
        refetchOnWindowFocus: false,
      });
    },
    invalidate(query: GetAllAppConfigQueryParams, queryClient: QueryClient) {
      queryClient.invalidateQueries({
        queryKey: ["app-config", "list", query],
      });
    },
  },
  getById: {
    useQuery(id: string) {
      return useQuery({
        queryKey: ["app-config", "getById", id],
        queryFn: () => appConfigService.getById(id),
        refetchOnWindowFocus: false,
      });
    },
    invalidate(id: string, queryClient: QueryClient) {
      queryClient.invalidateQueries({
        queryKey: ["app-config", "getById", id],
      });
    },
  },
  create: {
    useMutation(body: CreateAppConfigBodyParams, queryClient: QueryClient) {
      return useMutation({
        mutationFn: () => appConfigService.create(body),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["app-config", "list"],
          });
        },
      });
    },
  },
  update: {
    useMutation(
      id: string,
      body: UpdateAppConfigBodyParams,
      queryClient: QueryClient
    ) {
      return useMutation({
        mutationFn: () => appConfigService.update(id, body),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["app-config", "list"],
          });
        },
      });
    },
    delete: {
      useMutation(id: string, queryClient: QueryClient) {
        return useMutation({
          mutationFn: () => appConfigService.delete(id),
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["app-config", "list"],
            });
          },
        });
      },
    },
    deleteBulk: {
      useMutation(
        body: z.infer<typeof appConfigService.deleteBulkRequestBodySchema>,
        queryClient: QueryClient
      ) {
        return useMutation({
          mutationFn: () => appConfigService.deleteBulk(body),
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["app-config", "list"],
            });
          },
        });
      },
    },
  },
};
