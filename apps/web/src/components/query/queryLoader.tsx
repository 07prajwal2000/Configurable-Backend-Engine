"use client";

import { Group, Skeleton, Stack } from "@mantine/core";

type PropTypes = {
  skeletonsCols?: number;
  skeletonsRows?: number;
};

const QueryLoader = ({ skeletonsCols, skeletonsRows }: PropTypes) => {
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
