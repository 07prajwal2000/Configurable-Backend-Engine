import React, { useContext } from "react";
import BaseBlock from "./base";
import BlockHandle from "./handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbDoorExit } from "react-icons/tb";
import { DataSettingsProps } from "./settingsDialog/blockSettingsDialog";
import { Select, Stack } from "@mantine/core";
import z from "zod";
import { responseBlockSchema } from "@fluxify/blocks";
import { httpcodes } from "@fluxify/lib";
import { BlockCanvasContext } from "@/context/blockCanvas";

const Response = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbDoorExit size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      bottomLeftRounded
      bottomRightRounded
      optionsTooltip={["delete", "options"]}
      blockName="Response"
      labelPlacement="bottom"
    >
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export function ResponseBlockHelpPanel(
  props: DataSettingsProps<z.infer<typeof responseBlockSchema>>
) {
  return <>TODO: Add Docs link</>;
}

export function ResponseBlockDataSettingsPanel(
  props: DataSettingsProps<z.infer<typeof responseBlockSchema>>
) {
  const data = props.blockData;
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onHttpCodeChange(value: string | null) {
    if (!value) return;
    updateBlockData(props.blockId, { httpCode: value });
  }

  return (
    <Stack>
      <Select
        searchable
        label="Response HTTP Code"
        placeholder="Select HTTP Code"
        description="Choose the HTTP code to use for the response."
        value={data.httpCode}
        onChange={onHttpCodeChange}
        data={httpcodes.map((x) => ({
          value: x.code,
          label: `${x.name} (${x.code})`,
        }))}
        defaultValue="json"
      />
    </Stack>
  );
}

export default Response;
