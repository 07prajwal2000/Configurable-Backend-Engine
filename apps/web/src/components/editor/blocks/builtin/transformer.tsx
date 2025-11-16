import React, { useContext } from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbTransform } from "react-icons/tb";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import z from "zod";
import { transformerBlockSchema } from "@fluxify/blocks";
import { Checkbox, Divider, Stack, Text } from "@mantine/core";
import { BlockCanvasContext } from "@/context/blockCanvas";
import FieldMapEditor from "@/components/editors/fieldMapEditor";
import JsEditButton from "@/components/editors/jsEditButton";

const Transformer = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbTransform size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Transformer"
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

export const TransformerBlockDataSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof transformerBlockSchema>>
) => {
  const {
    blockData: { fieldMap, js, useJs },
  } = props;
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onFieldMapChange(data: Record<string, string>) {
    updateBlockData(props.blockId, { fieldMap: data });
  }

  function onJsChange(value: string) {
    updateBlockData(props.blockId, { js: value });
  }

  function onUseJsChange(value: boolean) {
    updateBlockData(props.blockId, { useJs: value });
  }

  return (
    <Stack px={"xs"}>
      <Checkbox
        color="violet"
        label="Use JS"
        description="Use JS to transform the data instead of field map"
        checked={useJs}
        onChange={(e) => onUseJsChange(e.currentTarget.checked)}
      />
      {!useJs && (
        <Stack gap={"xs"}>
          <Text>Field Map Editor</Text>
          <Divider />
          <FieldMapEditor
            fieldMap={fieldMap}
            onKeyValueChange={onFieldMapChange}
          />
        </Stack>
      )}
      {useJs && <JsEditButton value={js || ""} onChange={onJsChange} />}
    </Stack>
  );
};

export default Transformer;
