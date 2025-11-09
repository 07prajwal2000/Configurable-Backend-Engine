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

type Props = {
  blockData: any;
  collapsed?: boolean;
};

const HelpPanel = (props: Props) => {
  if (props.collapsed) return <></>;
  const { updateBlockData } = useContext(BlockCanvasContext);
  const data = props.blockData.data;

  function onBlockNameChange(value: string) {
    updateBlockData(props.blockData.id, { blockName: value });
  }

  function onBlockDescriptionChange(value: string) {
    updateBlockData(props.blockData.id, { blockDescription: value });
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
            value={props.blockData.id}
          />
          <TextInput
            placeholder="Block Type"
            label="Block Type"
            spellCheck={false}
            readOnly
            value={getHumanReadableBlockName(props.blockData.type)}
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
        {props.blockData.type === BlockTypes.stickynote && (
          <StickyNoteHelpPanel
            blockId={props.blockData.id}
            blockData={props.blockData.data}
          />
        )}
        {props.blockData.type === BlockTypes.response && (
          <ResponseBlockHelpPanel
            blockId={props.blockData.id}
            blockData={props.blockData.data}
          />
        )}
        {props.blockData.type === BlockTypes.arrayops && (
          <ArrayOperationsHelpPanel
            blockId={props.blockData.id}
            blockData={props.blockData.data}
          />
        )}
        {props.blockData.type === BlockTypes.foreachloop && (
          <ForeachLoopHelpPanel
            blockId={props.blockData.id}
            blockData={props.blockData.data}
          />
        )}
        {props.blockData.type === BlockTypes.forloop && (
          <ForloopHelpPanel
            blockId={props.blockData.id}
            blockData={props.blockData.data}
          />
        )}
      </Stack>
    </Box>
  );
};

export default HelpPanel;
