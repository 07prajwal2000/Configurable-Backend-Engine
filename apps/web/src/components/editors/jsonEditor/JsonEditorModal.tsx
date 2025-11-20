/**
 * JsonEditorModal Component
 * Wraps the JSON Editor inside a Mantine Modal
 */

import React from "react";
import { Modal, Button, Group } from "@mantine/core";
import JsonEditor from "./JsonEditor";
import { JsonEditorProps, JsonValue } from "./types";

interface JsonEditorModalProps extends Omit<JsonEditorProps, "onSave"> {
  /** Modal title */
  title: string;
  /** Modal open state */
  opened: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Callback when user saves */
  onSave: (value: JsonValue) => void;
  /** Modal size */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const JsonEditorModal: React.FC<JsonEditorModalProps> = ({
  title,
  opened,
  onClose,
  rootValueType,
  defaultValue,
  onSave,
  readonly = false,
  size = "xl",
}) => {
  const handleSave = (value: JsonValue) => {
    onSave(value);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      scrollAreaComponent={undefined}
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
        },
        body: {
          flex: 1,
          overflow: "auto",
        },
      }}
    >
      <JsonEditor
        rootValueType={rootValueType}
        defaultValue={defaultValue}
        onSave={handleSave}
        readonly={readonly}
      />
    </Modal>
  );
};

export default JsonEditorModal;
