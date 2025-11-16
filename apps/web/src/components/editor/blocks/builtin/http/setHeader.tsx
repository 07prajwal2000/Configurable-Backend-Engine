import React, { useContext } from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { useMantineTheme } from "@mantine/core";
import { FaHeading } from "react-icons/fa";
import BlockHandle from "../../handle";
import { Position } from "@xyflow/react";
import { DataSettingsProps } from "../../settingsDialog/blockSettingsDialog";
import z from "zod";
import { setHttpHeaderBlockSchema } from "@fluxify/blocks";
import { Stack } from "@mantine/core";
import { BlockCanvasContext } from "@/context/blockCanvas";
import JsTextInput from "@/components/editors/jsTextInput";

const SetHeader = (props: NodeProps) => {
  const violetColor = useMantineTheme().colors.violet[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<FaHeading color={violetColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Set Header"
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

export const SetHeaderSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof setHttpHeaderBlockSchema>>
) => {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onHeaderNameChange(value: string) {
    updateBlockData(props.blockId, { name: value });
  }
  function onHeaderValueChange(value: string) {
    updateBlockData(props.blockId, { value: value });
  }
  return (
    <Stack>
      <JsTextInput
        value={props.blockData.name}
        label="Header Name"
        placeholder="Authorization"
        description="The name of the header to set. Also accepts JS expression"
        onValueChange={onHeaderNameChange}
      />
      <JsTextInput
        value={props.blockData.value}
        label="Header Value"
        placeholder="token-123456"
        description="The value of the header to set. Also accepts JS expression"
        onValueChange={onHeaderValueChange}
      />
    </Stack>
  );
};

export default SetHeader;
