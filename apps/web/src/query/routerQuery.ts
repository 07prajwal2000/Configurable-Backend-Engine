import { GetAllRequestType, routesService } from "@/services/routes";
import { QueryClient, useQuery } from "@tanstack/react-query";

export const routesQueries = {
  getAll: {
    useQuery(pagination: GetAllRequestType) {
      return useQuery({
        queryKey: ["routes", "list", pagination],
        queryFn: async () => {
          return await routesService.getAll(pagination);
        },
        staleTime: Infinity,
      });
    },
    invalidate(client: QueryClient) {
      client.invalidateQueries({
        queryKey: ["routes", "list"],
        exact: false,
      });
    },
  },
  getById: {
    useQuery(id: string) {
      return useQuery({
        queryKey: ["routes", id],
        queryFn: async () => {
          return await routesService.getByID(id);
        },
        staleTime: Infinity,
      });
    },
    invalidate(client: QueryClient, id: string) {
      client.invalidateQueries({
        queryKey: ["routes", id],
        exact: false,
      });
    },
  },
};
