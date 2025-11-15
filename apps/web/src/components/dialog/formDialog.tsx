import { Modal, Text } from "@mantine/core";
import React from "react";

const FormDialog = ({
  open,
  onClose,
  children,
  title,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Modal
      opened={open}
      size={"xl"}
      title={
        <Text fw={"500"} size="xl">
          {title}
        </Text>
      }
      withCloseButton
      onClose={onClose}
    >
      <Modal.Body p={"xs"}>{children}</Modal.Body>
    </Modal>
  );
};

export default FormDialog;
