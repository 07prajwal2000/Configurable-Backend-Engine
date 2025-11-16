import React, { useContext } from "react";
import { NodeProps, Position } from "@xyflow/react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { FaMapSigns } from "react-icons/fa";
import { Divider, Stack, useMantineTheme } from "@mantine/core";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import { ifBlockSchema } from "@fluxify/blocks";
import z from "zod";
import ConditionsEditor from "@/components/editors/conditionsEditor";
import { Text } from "@mantine/core";
import { BlockCanvasContext } from "@/context/blockCanvas";

const IfCondition = (props: NodeProps) => {
  const theme = useMantineTheme();
  const successColor = theme.colors.green[8];
  const errorColor = theme.colors.red[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<FaMapSigns size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="If"
      labelPlacement="bottom"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Left}
        color={successColor}
        handleVariant="success"
      />
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Right}
        color={errorColor}
        handleVariant="failure"
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export function IfConditionSettingsPanel(
  props: DataSettingsProps<z.infer<typeof ifBlockSchema>>
) {
  const { updateBlockData } = useContext(BlockCanvasContext);

  const onConditionsChange = (
    conditions: z.infer<typeof ifBlockSchema>["conditions"]
  ) => {
    updateBlockData(props.blockId, { conditions });
  };
  return (
    <Stack px={"sm"} gap={4}>
      <Text size="lg">Add/Edit Conditions</Text>
      <Divider />
      <ConditionsEditor
        onChange={onConditionsChange}
        conditions={props.blockData.conditions}
      />
    </Stack>
  );
}

export function IfConditionHelpPanel(
  props: DataSettingsProps<z.infer<typeof ifBlockSchema>>
) {
  return <Stack></Stack>;
}

export default IfCondition;
