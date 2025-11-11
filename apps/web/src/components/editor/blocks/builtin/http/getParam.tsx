import React, { useContext } from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { Select, Stack, useMantineTheme } from "@mantine/core";
import { VscSymbolParameter } from "react-icons/vsc";
import BlockHandle from "../../handle";
import { Position } from "@xyflow/react";
import { getHttpParamBlockSchema } from "@cbe/blocks";
import JsTextInput from "@/components/editors/jsTextInput";
import { BlockCanvasContext } from "@/context/blockCanvas";
import z from "zod";
import { DataSettingsProps } from "../../settingsDialog/blockSettingsDialog";

const GetParam = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<VscSymbolParameter color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Param"
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

export const GetParamSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof getHttpParamBlockSchema>>
) => {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onParamNameChange(value: string) {
    updateBlockData(props.blockId, { name: value });
  }
  function onParamSourceChange(value: string | null) {
    if (!value) return;
    updateBlockData(props.blockId, { source: value });
  }

  return (
    <Stack px={"xs"}>
      <Select
        value={props.blockData.source}
        label="Parameter Source"
        placeholder="page"
        description="The name of the parameter to get from the request. Also accepts JS expression"
        onChange={onParamSourceChange}
        data={[
          { value: "path", label: "Path Param" },
          { value: "query", label: "Query Param" },
        ]}
      />
      <JsTextInput
        value={props.blockData.name}
        label="Parameter Name"
        placeholder="page"
        description={`The name of the parameter to get from the request. Also accepts JS expression. E.g. ${
          props.blockData.source === "path"
            ? "/{id} in this case, enter id to get the id parameter"
            : "?page=5 in this case, enter page to get the page parameter"
        }`}
        onValueChange={onParamNameChange}
      />
    </Stack>
  );
};

export default GetParam;
