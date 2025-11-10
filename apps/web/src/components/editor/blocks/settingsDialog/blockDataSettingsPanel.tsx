import { Box, Center } from "@mantine/core";
import React from "react";
import { BlockTypes } from "@/types/block";
import { StickyNoteSettingsPanel } from "../builtin/stickyNote";
import { ResponseBlockDataSettingsPanel } from "../response";
import { ArrayOperationsSettingsPanel } from "../builtin/arrayOperations";
import { ForeachLoopSettingsPanel } from "../builtin/foreachLoop";
import { ForloopSettingsPanel } from "../builtin/forloop";
import { GetVarSettingsPanel } from "../builtin/getVar";
import { SetVarSettingsPanel } from "../builtin/setVar";
import { IfConditionSettingsPanel } from "../builtin/if";

type Props = {
  blockData: {
    id: string;
    data: any;
    type: BlockTypes;
  };
};

const BlockDataSettingsPanel = (props: Props) => {
  const blockData = props.blockData.data;
  const blockId = props.blockData.id;
  switch (props.blockData.type) {
    case BlockTypes.stickynote:
      return (
        <StickyNoteSettingsPanel blockId={blockId} blockData={blockData} />
      );
    case BlockTypes.response:
      return (
        <ResponseBlockDataSettingsPanel
          blockData={blockData}
          blockId={blockId}
        />
      );
    case BlockTypes.arrayops:
      return (
        <ArrayOperationsSettingsPanel blockData={blockData} blockId={blockId} />
      );
    case BlockTypes.foreachloop:
      return (
        <ForeachLoopSettingsPanel blockData={blockData} blockId={blockId} />
      );
    case BlockTypes.forloop:
      return <ForloopSettingsPanel blockData={blockData} blockId={blockId} />;
    case BlockTypes.getvar:
      return <GetVarSettingsPanel blockData={blockData} blockId={blockId} />;
    case BlockTypes.setvar:
      return <SetVarSettingsPanel blockData={blockData} blockId={blockId} />;
    case BlockTypes.if:
      return (
        <IfConditionSettingsPanel blockData={blockData} blockId={blockId} />
      );
    default:
      return (
        <Center>No Data is available to edit for this type of block</Center>
      );
  }
};

export default BlockDataSettingsPanel;
