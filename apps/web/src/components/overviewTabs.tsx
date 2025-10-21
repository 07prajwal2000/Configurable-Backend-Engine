"use client";

import { Group, Tabs } from "@mantine/core";
import React from "react";
import RoutesPanel from "./panels/routesPanel";
import RouterFilter from "./filters/routerFilter";
import RouterPagination from "./filters/routerPagination";

type PropTypes = {
  tabs?: {
    label: string;
    content: React.ReactNode;
  }[];
  projectId?: string;
};

const OverviewTabs = (props: PropTypes) => {
  return (
    <Tabs
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
      color="violet"
      defaultValue={"routes"}
    >
      <Group
        style={{ position: "sticky", top: 0, zIndex: 100 }}
        w={"100%"}
        bg={"white"}
        gap={0}
      >
        <Tabs.List>
          <Tabs.Tab value={"routes"}>Routes</Tabs.Tab>
          <Tabs.Tab value={"executions"}>Executions</Tabs.Tab>
          {props.tabs?.map((tab, index) => (
            <Tabs.Tab key={index} value={tab.label}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Group ml={"auto"}>
          <RouterPagination />
          <RouterFilter />
        </Group>
      </Group>
      <Tabs.Panel value="routes">
        <RoutesPanel projectId={props.projectId} />
      </Tabs.Panel>
      <Tabs.Panel value="executions">Executions panel</Tabs.Panel>
      {props.tabs?.map((tab, index) => (
        <Tabs.Panel key={index} value={tab.label}>
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default OverviewTabs;
