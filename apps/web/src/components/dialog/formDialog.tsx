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
      title={<Text size="xl">{title}</Text>}
      withCloseButton
      onClose={onClose}
    >
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default FormDialog;
