"use client";

import AddIntegrationButton from "@/components/buttons/addIntegrationButton";
import AvailableConnectors from "@/components/panels/availableConnectors";
import { Grid, Group, Stack, Text } from "@mantine/core";
import React from "react";

const Page = () => {
  return (
    <Stack h={"100vh"} py={"xs"} px={"md"}>
      <Group align="center" justify="space-between">
        <Stack gap={"xs"}>
          <Text size="2rem" fw={"500"}>
            Integrations
          </Text>
          <Text size="sm" c={"gray"}>
            Connect & Configure 3rd Party Services
          </Text>
        </Stack>
        <AddIntegrationButton />
      </Group>
      <Grid flex={1} overflow="hidden" maw={"100%"}>
        <Grid.Col h={"100%"} span={3}>
          <AvailableConnectors />
        </Grid.Col>
        <Grid.Col span={7}></Grid.Col>
        <Grid.Col span={2}></Grid.Col>
      </Grid>
    </Stack>
  );
};

export default Page;
