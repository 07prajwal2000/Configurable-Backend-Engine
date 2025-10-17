import { Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { ZodType } from "zod";

type PropTypes = {
  newForm?: boolean;
  values?: Partial<{
    id: string;
    name: string | null;
    path: string | null;
    method: string | null;
  }>;
  onSubmit?: (value: {
    id: string;
    name: string;
    path: string;
    method: string;
  }) => void;
  zodSchema: ZodType;
  actionSection?: React.ReactNode;
};

const RouteForm = (props: PropTypes) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: props.values?.name || "",
      path: props.values?.path || "",
      method: props.values?.method || "GET",
    },
  });

  function onSubmit(value: typeof form.values) {
    const { success, data, error } = props.zodSchema.safeParse(value);
    if (!success) {
      for (let err of error.issues) {
        form.setFieldError(err.path[0].toString(), err.message);
      }
      return;
    }
    props.onSubmit?.({ id: props.values?.id ?? "", ...(data as typeof value) });
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        label="Name"
        placeholder="Create user"
        {...form.getInputProps("name")}
      />
      <TextInput
        label="Path"
        placeholder="/api/users/create"
        {...form.getInputProps("path")}
      />
      <Select
        label="Method"
        placeholder="POST"
        data={["GET", "POST", "PUT", "DELETE"]}
        {...form.getInputProps("method")}
      />
      {props.actionSection}
    </form>
  );
};

export default RouteForm;
