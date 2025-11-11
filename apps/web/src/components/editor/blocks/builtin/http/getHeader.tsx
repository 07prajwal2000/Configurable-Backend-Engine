import React, { useContext } from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { Stack, useMantineTheme } from "@mantine/core";
import { FaHeading } from "react-icons/fa";
import BlockHandle from "../../handle";
import { Position } from "@xyflow/react";
import { getHttpHeaderBlockSchema } from "@cbe/blocks";
import JsTextInput from "@/components/editors/jsTextInput";
import { BlockCanvasContext } from "@/context/blockCanvas";
import z from "zod";
import { DataSettingsProps } from "../../settingsDialog/blockSettingsDialog";

const GetHeader = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<FaHeading color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Header"
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

export const GetHeaderSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof getHttpHeaderBlockSchema>>
) => {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onHeaderNameChange(value: string) {
    updateBlockData(props.blockId, { name: value });
  }

  return (
    <Stack px={"xs"}>
      <JsTextInput
        value={props.blockData.name}
        label="Header Name"
        placeholder="Authorization"
        description="The name of the header to get from the request. Also accepts JS expression"
        onValueChange={onHeaderNameChange}
      />
    </Stack>
  );
};

export default GetHeader;
