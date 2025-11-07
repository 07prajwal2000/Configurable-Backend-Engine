import { Box, Center } from "@mantine/core";
import React from "react";
import { BlockTypes } from "@/types/block";
import { StickyNoteSettingsPanel } from "../builtin/stickyNote";
import { ResponseBlockDataSettingsPanel } from "../response";
import { ArrayOperationsSettingsPanel } from "../builtin/arrayOperations";

type Props = {
  blockData: {
    id: string;
    data: any;
    type: BlockTypes;
    position: { x: number; y: number };
  };
};

const BlockDataSettingsPanel = (props: Props) => {
  switch (props.blockData.type) {
    case BlockTypes.stickynote:
      return (
        <StickyNoteSettingsPanel
          blockId={props.blockData.id}
          blockData={props.blockData.data}
        />
      );
    case BlockTypes.response:
      return (
        <ResponseBlockDataSettingsPanel
          blockData={props.blockData.data}
          blockId={props.blockData.id}
        />
      );
    case BlockTypes.arrayops:
      return (
        <ArrayOperationsSettingsPanel
          blockData={props.blockData.data}
          blockId={props.blockData.id}
        />
      );
    default:
      return (
        <Center>No Data is available to edit for this type of block</Center>
      );
  }
};

export default BlockDataSettingsPanel;
