import OverviewTabs from "@/components/overviewTabs";
import ProjectPageOverview from "@/components/panels/projectPageOverview";
import { Stack } from "@mantine/core";
import React from "react";

const Page = async (params: any) => {
  const { projectId } = await params.params;
  return (
    <Stack style={{ height: "100vh" }} p={"lg"}>
      <ProjectPageOverview projectId={projectId} />
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
