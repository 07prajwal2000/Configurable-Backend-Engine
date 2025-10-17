"use client";

import { Stack } from "@mantine/core";
import React, { useEffect } from "react";
import RouteItem from "../routeItem";
import { routesQueries } from "@/app/query/routerQuery";
import { useRouterPagination } from "@/app/store/routes";

const RoutesPanel = () => {
  const { page, perPage, setPaginationLimit } = useRouterPagination();
  const { useQuery, invalidate: useInvalidate } = routesQueries.getAll;
  const { data, isLoading, isError, error } = useQuery({ page, perPage });

  useEffect(() => {
    if (isError || isLoading || !data?.data) return;
    setPaginationLimit(data.pagination.totalPages);
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

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
