import React, { useContext } from "react";
import { NodeProps, Position } from "@xyflow/react";
import { TbInfinity } from "react-icons/tb";
import { Checkbox, Stack, useMantineTheme } from "@mantine/core";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { forEachLoopBlockSchema } from "@cbe/blocks";
import { z } from "zod";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import { BlockCanvasContext } from "@/context/blockCanvas";
import ArrayEditor from "@/components/editors/arrayEditor";

const ForeachLoop = (props: NodeProps) => {
  const violetColor = useMantineTheme().colors.violet[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbInfinity color={violetColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Foreach"
      labelPlacement="left"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Right}
        color="green"
        handleVariant="executor"
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export function ForeachLoopHelpPanel(
  props: DataSettingsProps<z.infer<typeof forEachLoopBlockSchema>>
) {
  return <></>;
}

export function ForeachLoopSettingsPanel(
  props: DataSettingsProps<z.infer<typeof forEachLoopBlockSchema>>
) {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onUseParamChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateBlockData(props.blockId, { useParam: e.currentTarget.checked });
  }

  function onValueChange(index: number, value: any) {
    updateBlockData(props.blockId, {
      values: props.blockData.values.map((item, i) =>
        i === index ? value : item
      ),
    });
  }

  function onAdd() {
    updateBlockData(props.blockId, {
      values: [...props.blockData.values, ""],
    });
  }

  function onRemove(index: number) {
    updateBlockData(props.blockId, {
      values: props.blockData.values.filter((_, i) => i !== index),
    });
  }

  return (
    <Stack>
      <Checkbox
        label="Use Param"
        color="violet"
        description="Use input parameter as the datasource?"
        checked={props.blockData.useParam}
        onChange={onUseParamChange}
      />
      {!props.blockData.useParam && (
        <ArrayEditor
          array={props.blockData.values}
          onValueChange={onValueChange}
          showAddButton
          onAdd={onAdd}
          onRemove={onRemove}
        />
      )}
    </Stack>
  );
}

export default ForeachLoop;
