import { Button, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import FormDialog from "./formDialog";
import IntegrationForm from "../forms/integration";
import AppConfigForm from "../forms/appConfig";

type PropTypes = {
  children: React.ReactNode;
  form: "integration" | "appconfig";
  formTitle: string;
  displayMenuItem?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const FormDialogButton = ({
  children,
  form,
  formTitle,
  displayMenuItem,
  ...props
}: PropTypes) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {displayMenuItem ? (
        <Menu.Item
          leftSection={props.leftIcon}
          rightSection={props.rightIcon}
          onClick={open}
        >
          {children}
        </Menu.Item>
      ) : (
        <Button
          leftSection={props.leftIcon}
          rightSection={props.rightIcon}
          onClick={open}
        >
          {children}
        </Button>
      )}
      <FormDialog open={opened} onClose={close} title={formTitle}>
        {form === "integration" && <IntegrationForm />}
        {form === "appconfig" && <AppConfigForm />}
      </FormDialog>
    </>
  );
};

export default FormDialogButton;
