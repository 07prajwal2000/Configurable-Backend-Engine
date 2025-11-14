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
        queryFn: () => {
          if (!id) {
            return null;
          }
          return appConfigService.getById(id);
        },
        refetchOnWindowFocus: false,
      });
    },
    invalidate(id: string, queryClient: QueryClient) {
      queryClient.invalidateQueries({
        queryKey: ["app-config", "getById", id],
      });
    },
  },
  getKeysList: {
    useQuery(search: string) {
      return useQuery({
        queryKey: ["app-config", "getKeysList", search],
        queryFn: () => appConfigService.getKeysList(search),
        refetchOnWindowFocus: false,
      });
    },
    invalidate(search: string, queryClient: QueryClient) {
      queryClient.invalidateQueries({
        queryKey: ["app-config", "getKeysList", search],
      });
    },
  },
  create: {
    useMutation(queryClient: QueryClient) {
      return useMutation({
        mutationFn: (data: CreateAppConfigBodyParams) =>
          appConfigService.create(data),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["app-config", "list"],
          });
        },
      });
    },
  },
  update: {
    useMutation(id: string, queryClient: QueryClient) {
      return useMutation({
        mutationFn: (data: UpdateAppConfigBodyParams) =>
          appConfigService.update(id, data),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["app-config", "list"],
          });
        },
      });
    },
  },
  delete: {
    useMutation(queryClient: QueryClient) {
      return useMutation({
        mutationFn: (id: string) => appConfigService.delete(id),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["app-config", "list"],
          });
        },
      });
    },
  },
  deleteBulk: {
    useMutation(queryClient: QueryClient) {
      return useMutation({
        mutationFn: (
          data: z.infer<typeof appConfigService.deleteBulkRequestBodySchema>
        ) => appConfigService.deleteBulk(data),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["app-config", "list"],
          });
        },
      });
    },
  },
};
