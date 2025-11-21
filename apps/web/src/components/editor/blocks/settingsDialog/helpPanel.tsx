import { BlockCanvasContext } from "@/context/blockCanvas";
import { Box, Flex, Stack, TextInput } from "@mantine/core";
import React, { useContext } from "react";
import { StickyNoteHelpPanel } from "../builtin/stickyNote";
import { BlockTypes } from "@/types/block";
import { getHumanReadableBlockName } from "@/lib/blockFactory";
import { ResponseBlockHelpPanel } from "../response";
import { ArrayOperationsHelpPanel } from "../builtin/arrayOperations";
import { ForeachLoopHelpPanel } from "../builtin/foreachLoop";
import DebouncedTextInput from "@/components/editors/debouncedTextInput";
import DebouncedTextArea from "@/components/editors/debouncedTextArea";
import { ForloopHelpPanel } from "../builtin/forloop";
import { GetVarHelpPanel } from "../builtin/getVar";
import { IfConditionHelpPanel } from "../builtin/if";
import { JsRunnerHelpPanel } from "../builtin/jsRunner";
import { NativeBlockHelpPanel } from "../builtin/database/native";

type Props = {
  blockId: string;
  blockData: any;
  collapsed?: boolean;
  blockType: BlockTypes;
};

const HelpPanel = (props: Props) => {
  if (props.collapsed) return <></>;
  const { updateBlockData } = useContext(BlockCanvasContext);
  const data = props.blockData;
  const blockType = props.blockType;

  function onBlockNameChange(value: string) {
    updateBlockData(props.blockId, { blockName: value });
  }

  function onBlockDescriptionChange(value: string) {
    updateBlockData(props.blockId, { blockDescription: value });
  }

  return (
    <Box>
      <Stack gap={"4"}>
        <Flex direction={"row"} gap={"xs"}>
          <TextInput
            placeholder="Block ID"
            label="Block ID"
            spellCheck={false}
            readOnly
            value={props.blockId}
          />
          <TextInput
            placeholder="Block Type"
            label="Block Type"
            spellCheck={false}
            readOnly
            value={getHumanReadableBlockName(blockType)}
          />
        </Flex>
        <DebouncedTextInput
          placeholder="Block Name"
          label="Block Name"
          spellCheck={false}
          value={data.blockName || ""}
          debounceDelay={450}
          onValueChange={(value) => onBlockNameChange(value)}
        />
        <DebouncedTextArea
          placeholder="Block Description"
          label="Block Description"
          value={data.blockDescription || ""}
          rows={4}
          debounceDelay={250}
          onValueChange={(value) => onBlockDescriptionChange(value)}
        />
        {blockType === BlockTypes.stickynote && (
          <StickyNoteHelpPanel blockId={props.blockId} blockData={data} />
        )}
        {blockType === BlockTypes.response && (
          <ResponseBlockHelpPanel blockId={props.blockId} blockData={data} />
        )}
        {blockType === BlockTypes.arrayops && (
          <ArrayOperationsHelpPanel blockId={props.blockId} blockData={data} />
        )}
        {blockType === BlockTypes.foreachloop && (
          <ForeachLoopHelpPanel blockId={props.blockId} blockData={data} />
        )}
        {blockType === BlockTypes.forloop && (
          <ForloopHelpPanel blockId={props.blockId} blockData={data} />
        )}
        {blockType === BlockTypes.getvar && (
          <GetVarHelpPanel blockId={props.blockId} blockData={data} />
        )}
        {blockType === BlockTypes.if && (
          <IfConditionHelpPanel blockId={props.blockId} blockData={data} />
        )}
        {blockType === BlockTypes.jsrunner && (
          <JsRunnerHelpPanel blockId={props.blockId} blockData={data} />
        )}
        {blockType === BlockTypes.db_native && (
          <NativeBlockHelpPanel blockId={props.blockId} blockData={data} />
        )}
      </Stack>
    </Box>
  );
};

export default HelpPanel;
