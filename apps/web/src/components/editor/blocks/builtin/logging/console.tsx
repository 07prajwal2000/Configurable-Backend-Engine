import React, { useContext } from "react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbTerminal2 } from "react-icons/tb";
import JsEditor from "@/components/editors/jsEditor";
import { Stack, Divider, Text, Select } from "@mantine/core";
import z from "zod";
import { DataSettingsProps } from "../../settingsDialog/blockSettingsDialog";
import { logBlockSchema } from "@fluxify/blocks/builtin/log";
import { BlockCanvasContext } from "@/context/blockCanvas";
import JsTextInput from "@/components/editors/jsTextInput";

const Console = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbTerminal2 size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Console"
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

export const ConsoleSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof logBlockSchema>>
) => {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onLevelChange(value: string | null) {
    if (!value) return;
    updateBlockData(props.blockId, { level: value });
  }

  function onMessageChange(value: string) {
    updateBlockData(props.blockId, { message: value });
  }

  return (
    <Stack px={"xs"}>
      <Select
        data={[
          { value: "info", label: "Info" },
          { value: "warn", label: "Warn" },
          { value: "error", label: "Error" },
        ]}
        label="Log Level"
        value={props.blockData.level}
        onChange={(value) => onLevelChange(value)}
      />
      <JsTextInput
        value={props.blockData.message}
        label="Message"
        placeholder="Hello World"
        description="The message to log to the console. Also supports JS expressions"
        onValueChange={onMessageChange}
      />
    </Stack>
  );
};

export default Console;
