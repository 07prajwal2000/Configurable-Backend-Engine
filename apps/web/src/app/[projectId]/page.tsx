import CreateNewMenu from "@/components/createNewMenu";
import OverviewTabs from "@/components/overviewTabs";
import { Stack, Group, Text } from "@mantine/core";
import React from "react";

const Page = async (params: PageProps<"/[projectId]">) => {
  const { projectId } = await params.params;
  return (
    <Stack style={{ height: "100vh" }} p={"lg"}>
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Text size={"3rem"}>Overview</Text>
          <Text c={"gray"} size={".5rem"}>
            All routes, execution history you have access to
          </Text>
        </Stack>
        <CreateNewMenu />
      </Group>
      <OverviewTabs tabs={extraTabs} projectId={projectId} />
    </Stack>
  );
};

const extraTabs = [
  {
    label: "Settings",
    content: <h2>Settings Panel</h2>,
  },
];

export default Page;
