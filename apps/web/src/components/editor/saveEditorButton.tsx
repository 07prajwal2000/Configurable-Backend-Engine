import { useEditorChangeTrackerStore } from "@/store/editor";
import { Button } from "@mantine/core";
import React from "react";
import { TbDeviceFloppy } from "react-icons/tb";

const SaveEditorButton = () => {
  const changeTracker = useEditorChangeTrackerStore();
  const disableButton = changeTracker.tracker.size === 0;
  return (
    <Button
      size="xs"
      disabled={disableButton}
      variant="light"
      color="violet"
      leftSection={<TbDeviceFloppy size={18} />}
    >
      Save
    </Button>
  );
};

export default SaveEditorButton;
