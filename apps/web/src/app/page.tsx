"use client;";
import CreateNewMenu from "@/components/createNewMenu";
import OverviewTabs from "@/components/overviewTabs";
import { Group, Stack, Text } from "@mantine/core";

export default function Home() {
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
      <OverviewTabs />
    </Stack>
  );
}
