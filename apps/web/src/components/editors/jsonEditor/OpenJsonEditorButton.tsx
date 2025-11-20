/**
 * OpenJsonEditorButton Component
 * Button that opens the JSON Editor Modal
 */

import React from "react";
import { Button, ButtonProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import JsonEditorModal from "./JsonEditorModal";
import { JsonEditorProps, JsonValue } from "./types";

interface OpenJsonEditorButtonProps
  extends Omit<JsonEditorProps, "onSave">,
    Omit<ButtonProps, "onClick" | "children"> {
  /** Button label */
  label: string;
  /** Callback when user saves */
  onSave: (value: JsonValue) => void;
  /** Modal title (defaults to label) */
  modalTitle?: string;
}

const OpenJsonEditorButton: React.FC<OpenJsonEditorButtonProps> = ({
  label,
  onSave,
  modalTitle,
  rootValueType,
  defaultValue,
  readonly = false,
  disabled = false,
  ...buttonProps
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        onClick={open}
        disabled={disabled}
        color="violet"
        {...buttonProps}
      >
        {label}
      </Button>
      <JsonEditorModal
        opened={opened}
        onClose={close}
        title={modalTitle || label}
        rootValueType={rootValueType}
        defaultValue={defaultValue}
        onSave={onSave}
        readonly={readonly}
      />
    </>
  );
};

export default OpenJsonEditorButton;
