import React, { useContext } from "react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbCookie } from "react-icons/tb";
import { Stack, useMantineTheme } from "@mantine/core";
import JsTextInput from "@/components/editors/jsTextInput";
import { BlockCanvasContext } from "@/context/blockCanvas";
import z from "zod";
import { DataSettingsProps } from "../../settingsDialog/blockSettingsDialog";
import { getHttpCookieBlockSchema } from "@cbe/blocks";

const GetCookie = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbCookie color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Cookie"
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

export const GetCookieSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof getHttpCookieBlockSchema>>
) => {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onCookieNameChange(value: string) {
    updateBlockData(props.blockId, { name: value });
  }

  return (
    <Stack px={"xs"}>
      <JsTextInput
        value={props.blockData.name}
        label="Cookie Name"
        placeholder="Authorization"
        description="The name of the cookie to get from the request. Also accepts JS expression"
        onValueChange={onCookieNameChange}
      />
    </Stack>
  );
};

export default GetCookie;
