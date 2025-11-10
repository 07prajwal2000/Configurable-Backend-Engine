import React, { useContext } from "react";
import { NodeProps } from "@xyflow/react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { Position } from "@xyflow/react";
import { IoLogoJavascript } from "react-icons/io";
import JsEditor from "@/components/editors/jsEditor";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import z from "zod";
import { jsRunnerBlockSchema } from "@cbe/blocks";
import { Divider, Stack, Text } from "@mantine/core";
import { BlockCanvasContext } from "@/context/blockCanvas";

const JsRunner = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<IoLogoJavascript size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="JS Runner"
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

export const JsRunnerSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof jsRunnerBlockSchema>>
) => {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onJsCodeChange(value: string) {
    updateBlockData(props.blockId, { value });
  }

  return (
    <Stack>
      <Text>Edit JS Code</Text>
      <Divider />
      <JsEditor
        height={450}
        value={props.blockData.value}
        onChange={onJsCodeChange}
      />
    </Stack>
  );
};

export const JsRunnerHelpPanel = (
  props: DataSettingsProps<z.infer<typeof jsRunnerBlockSchema>>
) => {
  return (
    <Stack>
      <Text>JS Runner</Text>
      <Text size="sm">TODO: show docs, variables</Text>
    </Stack>
  );
};

export default JsRunner;
