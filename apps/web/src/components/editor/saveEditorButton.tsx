import { Button } from "@mantine/core";
import React from "react";
import { TbDeviceFloppy } from "react-icons/tb";

const SaveEditorButton = () => {
  return (
    <Button
      size="xs"
      variant="light"
      color="violet"
      leftSection={<TbDeviceFloppy size={18} />}
    >
      Save
    </Button>
  );
};

export default SaveEditorButton;
