import { integrationsQuery } from "@/query/integrationsQuery";
import React from "react";
import QueryLoader from "../query/queryLoader";
import QueryError from "../query/queryError";
import { useQueryClient } from "@tanstack/react-query";
import { ZodType } from "zod";
import { useForm } from "@mantine/form";
import { Button, Group, Select, Stack } from "@mantine/core";
import {
  getSchema,
  getIntegrationsGroups,
  getIntegrationsVariants,
  getDefaultVariantValue,
} from "@cbe/backend-engine/src/api/v1/integrations/helpers";
import { getZodValidatedErrors } from "@/lib/forms";
import PostgresForm from "./databases/postgres";
import TestIntegrationConnectionButton from "../buttons/testIntegrationConnectionButton";
import SaveIntegrationButton from "../buttons/saveIntegrationButton";

type PropTypes = {
  onSubmit?: (data: any) => void;
  data?: { name: string; group: string; variant: string; config: any };
  id?: string;
  zodSchema?: ZodType;
  showTestConnection?: boolean;
  isLoading?: boolean;
  showSaveButton?: boolean;
  saveButtonLabel?: string;
};

const IntegrationForm = (props: PropTypes) => {
  const useQuery = integrationsQuery.getById.query;
  const { data, isLoading, isError, error } = useQuery(props.id || "");
  const form = useForm({
    initialValues: {
      name: data?.name || "",
      group: data?.group || "",
      variant: data?.variant || "",
      config: data?.config,
    },
    onValuesChange(values, previous) {
      if (previous.variant !== values.variant) {
        form.setValues({
          ...values,
          config: (getDefaultVariantValue(values.variant as any) as any) ?? {},
        });
      }
    },
    validate(values) {
      const schema = getSchema(values.group as any, values.variant as any);
      if (!schema) {
        return {
          group: "Invalid group",
          variant: "Invalid variant",
        };
      }
      return getZodValidatedErrors(schema)(values.config, "config.");
    },
  });
  const client = useQueryClient();

  if (isLoading) {
    return <QueryLoader skeletonsCols={1} skeletonsRows={3} />;
  }
  if (isError) {
    return (
      <QueryError
        error={error}
        refetcher={() => {
          integrationsQuery.getById.invalidate(props.id || "", client);
        }}
      />
    );
  }
  return (
    <form onSubmit={form.onSubmit((values) => props.onSubmit?.(values))}>
      <Stack>
        <Select
          label="Choose a Connector"
          description="Choose from a range of connectors to get started"
          {...form.getInputProps("group")}
          data={getIntegrationsGroups()}
        />
        {form.values.group && (
          <Select
            label="Select Variant"
            description="Select the service you want to configure & connect to"
            {...form.getInputProps("variant")}
            data={getIntegrationsVariants(form.values.group as any)}
          />
        )}
        {form.values.group === "database" &&
          form.values.variant === "PostgreSQL" && <PostgresForm form={form} />}
        <Group justify="space-between">
          {props.showTestConnection &&
            form.values.group &&
            form.values.variant && (
              <TestIntegrationConnectionButton
                data={form.values.config}
                group={form.values.group}
                variant={form.values.variant}
              />
            )}
          {props.showSaveButton && form.values.group && form.values.variant && (
            <SaveIntegrationButton
              loading={props.isLoading}
              label={props.saveButtonLabel}
            />
          )}
        </Group>
      </Stack>
    </form>
  );
};

export default IntegrationForm;
