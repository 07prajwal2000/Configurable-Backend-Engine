import { Tooltip, ActionIcon, Text } from "@mantine/core";
import React from "react";
import { TbNote, TbPlus } from "react-icons/tb";

const AddStickyNoteButton = () => {
  return (
    <Tooltip
      position="left"
      withArrow
      arrowSize={8}
      bg={"dark"}
      label={<Text size={"xs"}>Add Sticky Note</Text>}
    >
      <ActionIcon bg={"white"} size={"lg"} color="violet" variant="outline">
        <TbNote size={20} />
      </ActionIcon>
    </Tooltip>
  );
};

export default AddStickyNoteButton;
