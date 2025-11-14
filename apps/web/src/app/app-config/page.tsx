import AppConfigList from "@/components/panels/appConfigList";
import { AppConfigProvider } from "@/context/appConfigPage";
import { Stack, Text } from "@mantine/core";
import React from "react";

const Page = () => {
  return (
    <AppConfigProvider>
      <Stack px={"xs"}>
        <Stack gap={0}>
          <Text fw={"500"} size="2em">
            App Configuration
          </Text>
          <Text size="sm" c={"gray"}>
            A list of all secrets, configurations and variables are here
          </Text>
        </Stack>
        <AppConfigList />
      </Stack>
    </AppConfigProvider>
  );
};

export default Page;
