"use client";

import { Box, Group, Tabs } from "@mantine/core";
import React from "react";
import RoutesPanel from "./panels/routesPanel";
import RouterFilter from "./filters/routerFilter";
import RouterPagination from "./filters/routerPagination";

const OverviewTabs = () => {
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
        </Tabs.List>
        <Group ml={"auto"}>
          <RouterPagination />
          <RouterFilter />
        </Group>
      </Group>
      <Tabs.Panel value="routes">
        <RoutesPanel />
      </Tabs.Panel>
      <Tabs.Panel value="executions">Executions panel</Tabs.Panel>
    </Tabs>
  );
};

export default OverviewTabs;
