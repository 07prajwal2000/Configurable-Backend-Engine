import React, { useContext } from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbCodeVariablePlus } from "react-icons/tb";
import { Stack, useMantineTheme } from "@mantine/core";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import { getVarBlockSchema } from "@cbe/blocks";
import z from "zod";
import VariableSelector from "@/components/editors/variableSelector";
import { BlockCanvasContext } from "@/context/blockCanvas";

const GetVar = (props: NodeProps) => {
  const theme = useMantineTheme().colors.green;
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbCodeVariablePlus color={theme[8]} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Variable"
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

export function GetVarSettingsPanel(
  props: DataSettingsProps<z.infer<typeof getVarBlockSchema>>
) {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onKeyChange(value: string) {
    updateBlockData(props.blockId, { key: value });
  }

  return (
    <Stack>
      <VariableSelector
        label="Variable"
        placeholder="Type to search or enter variable name"
        description="Choose a variable to get its value"
        value={props.blockData.key}
        onChange={onKeyChange}
      />
    </Stack>
  );
}

export const GetVarHelpPanel = (
  props: DataSettingsProps<z.infer<typeof getVarBlockSchema>>
) => {
  return <></>;
};

export default GetVar;
