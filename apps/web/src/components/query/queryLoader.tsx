"use client";

import { Center, Group, Loader, Skeleton, Stack } from "@mantine/core";

type PropTypes = {
  skeletonsCols?: number;
  skeletonsRows?: number;
  type?: "skeleton" | "spinner";
  spinnerSize?: "xs" | "sm" | "md" | "lg" | "xl";
};

const QueryLoader = ({
  skeletonsCols,
  skeletonsRows,
  type,
  spinnerSize,
}: PropTypes) => {
  if (type === "spinner") {
    return (
      <Center h={"100%"} w={"100%"}>
        <Loader size={spinnerSize ?? "md"} color="violet" />
      </Center>
    );
  }
  const rows = Array(skeletonsRows ?? 3).fill(0),
    columns = Array(skeletonsCols ?? 1).fill(0);
  return (
    <Group gap={"xs"} justify="space-around">
      {columns.map((_, i) => (
        <Stack w={`${95 / (skeletonsCols ?? 1)}%`} key={i}>
          {rows.map((_, j) => (
            <Skeleton w={"100%"} p={"lg"} key={`${i}-${j}`} />
          ))}
        </Stack>
      ))}
    </Group>
  );
};

export default QueryLoader;
