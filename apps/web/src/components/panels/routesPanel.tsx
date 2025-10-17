"use client";

import { Box, Stack } from "@mantine/core";
import React, { useEffect } from "react";
import RouteItem from "../routeItem";
import { routesQueries } from "@/query/routerQuery";
import { useRouterPagination } from "@/app/store/routes";
import QueryLoader from "../query/queryLoader";
import QueryError from "../query/queryError";
import { useQueryClient } from "@tanstack/react-query";

const RoutesPanel = () => {
  const { page, perPage, setPaginationLimit } = useRouterPagination();
  const { useQuery, invalidate } = routesQueries.getAll;
  const { data, isLoading, isError, error } = useQuery({ page, perPage });
  const client = useQueryClient();

  useEffect(() => {
    if (isError || isLoading || !data?.data) return;
    setPaginationLimit(data.pagination.totalPages);
  }, [data]);

  if (isLoading)
    return (
      <Box w={"100%"} mt={"xl"}>
        <QueryLoader skeletonsRows={6} />
      </Box>
    );

  if (isError) {
    return (
      <QueryError
        error={error!}
        refetcher={() => {
          invalidate(client);
        }}
      />
    );
  }

  return (
    <Stack w={"100%"} py={"xs"} gap={"xs"} h={"100%"}>
      {data?.data.map((route) => (
        <RouteItem
          key={route.id}
          id={route.id}
          name={route.name!}
          method={route.method!}
          path={route.path!}
          updatedAt={route.createdAt}
          createdAt={route.createdAt}
          active={true}
        />
      ))}
    </Stack>
  );
};

export default RoutesPanel;
