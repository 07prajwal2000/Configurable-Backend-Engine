import React from "react";
import { Button } from "@mantine/core";
import { FaJs } from "react-icons/fa";
import JsEditorDialog from "../dialog/jsEditorDialog";
import { useDisclosure } from "@mantine/hooks";

interface Props {
  value: string;
  onChange?: (value: string) => void;
  label?: string;
  readonly?: boolean;
}

const JsEditButton = (props: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const onValueChange = (value: string) => {
    if (props.onChange) props.onChange(value);
    close();
  };

  return (
    <>
      <Button
        color="violet"
        fullWidth
        variant="outline"
        leftSection={<FaJs />}
        onClick={open}
      >
        {props.label || "Edit JS"}
      </Button>
      <JsEditorDialog
        onClose={close}
        opened={opened}
        value={props.value}
        onSave={onValueChange}
        readonly={props.readonly}
      />
    </>
  );
};

export default JsEditButton;
