import { ActionIcon, Button, Group, Stack, Text } from "@mantine/core";
import React from "react";
import MenuItem from "./menuItem";
import { TbCirclePlus, TbStack2 } from "react-icons/tb";
import { projectsQuery } from "@/query/projectsQuery";
import QueryLoader from "../query/queryLoader";
import QueryError from "../query/queryError";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

const ProjectList = () => {
  const { useQuery, invalidate } = projectsQuery.getAll;
  const client = useQueryClient();
  const path = usePathname().substring(1);
  const nav = useRouter();
  const queryParams = {
    page: 1,
    perPage: 50,
  };
  const { data, isLoading, isError, isRefetching } = useQuery(queryParams);
  if (isLoading || isRefetching) {
    return <QueryLoader skeletonsRows={3} skeletonsCols={1} />;
  }
  if (isError) {
    return (
      <QueryError
        fontSize="xs"
        overrideMessage="Error loading projects"
        refetcher={() => invalidate(queryParams, client)}
      />
    );
  }
  function onProjectItemClicked(projectId: string) {
    nav.push(`/${projectId}`);
  }

  return (
    <Stack pb={"md"} mah={"100%"} gap={"xs"} style={{ overflowY: "auto" }}>
      <Group
        bg={"white"}
        pb={2}
        style={{ position: "sticky", top: 0, zIndex: 10 }}
        justify="space-between"
        align="center"
      >
        <Text px={"sm"} c={"gray"}>
          Projects
        </Text>
        <ActionIcon color="violet" variant="light">
          <TbCirclePlus size={20} />
        </ActionIcon>
      </Group>
      <Stack gap={4}>
        {(data?.data?.length ?? 0) === 0 && <EmptyProjectInfo />}
        {data?.data?.map((project) => (
          <MenuItem
            key={project.id}
            onClick={() => onProjectItemClicked(project.id)}
            leftIcon={<TbStack2 size={20} />}
            isActive={path === project.id}
            text={project.name!}
            color="dark"
          />
        ))}
      </Stack>
    </Stack>
  );
};

function EmptyProjectInfo() {
  return (
    <Stack p={"md"} bdrs={"sm"} bd={"1px solid gray"}>
      <Text ta={"center"} size="sm" c={"gray"}>
        No projects here
      </Text>
      <Button leftSection={<TbCirclePlus size={20} />} color="violet">
        Add Project
      </Button>
    </Stack>
  );
}

export default ProjectList;
