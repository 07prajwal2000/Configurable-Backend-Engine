import { useCanvasActionsStore } from "@/store/canvas";
import { ActionIcon, Tooltip } from "@mantine/core";
import React from "react";
import { MdOutlineCleaningServices } from "react-icons/md";

const FormatBlocksButton = () => {
  const { formatBlocks } = useCanvasActionsStore().blocks;
  return (
    <Tooltip
      onClick={formatBlocks}
      label={"Format Blocks"}
      withArrow
      arrowSize={8}
      bg={"dark"}
    >
      <ActionIcon size={"lg"} variant="subtle" color={"dark"}>
        <MdOutlineCleaningServices size={18} />
      </ActionIcon>
    </Tooltip>
  );
};

export default FormatBlocksButton;
