import React from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbCodeVariablePlus } from "react-icons/tb";
import { useMantineTheme } from "@mantine/core";
import { useContext } from "react";
import { BlockCanvasContext } from "@/context/blockCanvas";
import { Stack } from "@mantine/core";
import VariableSelector from "@/components/editors/variableSelector";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import z from "zod";
import { setVarSchema } from "@cbe/blocks";
import DebouncedTextInput from "@/components/editors/debouncedTextInput";
import JsTextInput from "@/components/editors/jsTextInput";

const SetVar = (props: NodeProps) => {
  const theme = useMantineTheme().colors.violet;
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbCodeVariablePlus color={theme[8]} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Set Variable"
      labelPlacement="left"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export function SetVarSettingsPanel(
  props: DataSettingsProps<z.infer<typeof setVarSchema>>
) {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onKeyChange(value: string) {
    updateBlockData(props.blockId, { key: value });
  }

  function onValueChange(value: string) {
    updateBlockData(props.blockId, { value });
  }

  return (
    <Stack>
      <DebouncedTextInput
        placeholder="Variable Name"
        description="The name of the variable"
        label="Variable Name"
        spellCheck={false}
        value={props.blockData.key || ""}
        debounceDelay={450}
        onValueChange={onKeyChange}
      />
      <JsTextInput
        placeholder="Value"
        description="The value of the variable (can be number,bool,string,object or js expression)"
        label="Value"
        spellCheck={false}
        value={props.blockData.value || ""}
        onValueChange={onValueChange}
      />
    </Stack>
  );
}

export default SetVar;
