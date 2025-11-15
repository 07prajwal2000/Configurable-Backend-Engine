import AppConfigSelector from "@/components/editors/appConfigSelector";
import {
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Grid,
  Stack,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React, { useState } from "react";

type PropTypes = {
  form: UseFormReturnType<any>;
};

const PostgresForm = (props: PropTypes) => {
  const form = props.form;
  const selectedWindow = props.form.values.config?.source ?? "url";
  const isUrlSelected = selectedWindow === "url";
  function selectUrl() {
    form.setFieldValue("config.source", "url");
  }
  function selectCredentials() {
    form.setFieldValue("config.source", "credentials");
  }

  return (
    <Stack>
      <TextInput
        label="Name"
        required
        description="Name for the integration"
        placeholder="My Postgres Database"
        {...form.getInputProps("name")}
      />
      <ButtonGroup bd={"1px solid violet"} bdrs={"md"} w={"100%"}>
        <Button
          variant={isUrlSelected ? "subtle" : "filled"}
          color="violet"
          fullWidth
          onClick={selectCredentials}
        >
          Credentials
        </Button>
        <Button
          onClick={selectUrl}
          variant={isUrlSelected ? "filled" : "subtle"}
          color="violet"
          fullWidth
        >
          Via URL
        </Button>
      </ButtonGroup>
      {!isUrlSelected && (
        <Grid>
          <Grid.Col span={6}>
            <AppConfigSelector
              value={form.values.config?.host ?? ""}
              onChange={(value) => form.setFieldValue("config.host", value)}
              label="Host"
              description="Database Host"
              placeholder="postgres.company.com"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <AppConfigSelector
              value={form.values.config?.port?.toString() ?? ""}
              onChange={(value) => form.setFieldValue("config.port", value)}
              label="Port"
              description="Database Port"
              placeholder="5432"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <AppConfigSelector
              value={form.values.config?.username?.toString() ?? ""}
              onChange={(value) => form.setFieldValue("config.username", value)}
              label="Username"
              placeholder="postgres"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <AppConfigSelector
              value={form.values.config?.password?.toString() ?? ""}
              onChange={(value) => form.setFieldValue("config.password", value)}
              label="Password"
              placeholder="secret"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <AppConfigSelector
              value={form.values.config?.database?.toString() ?? ""}
              onChange={(value) => form.setFieldValue("config.database", value)}
              label="Database Name"
              placeholder="ecommerce"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Center h={"100%"} w={"fit-content"}>
              <Checkbox
                {...form.getInputProps("config.useSSL")}
                color="violet"
                label="Use SSL?"
              />
            </Center>
          </Grid.Col>
        </Grid>
      )}
      {isUrlSelected && (
        <AppConfigSelector
          value={form.values.config?.url ?? ""}
          onChange={(value) => form.setFieldValue("config.url", value)}
          label="URL"
          description="Connection String"
          placeholder="postgres://user:pass@host:port/dbname?ssl=disable"
        />
      )}
    </Stack>
  );
};

export default PostgresForm;
