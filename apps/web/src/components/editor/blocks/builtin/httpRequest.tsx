import React, { useContext } from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position } from "@xyflow/react";
import { MdHttp } from "react-icons/md";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import z from "zod";
import { httpRequestBlockSchema } from "@cbe/blocks/builtin/httpRequest";
import { Checkbox, Divider, Grid, Select, Stack, Text } from "@mantine/core";
import KVPEditor from "@/components/editors/kvpEditor";
import { BlockCanvasContext } from "@/context/blockCanvas";
import JsTextInput from "@/components/editors/jsTextInput";

const HttpRequest = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<MdHttp size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Http Request"
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

export const HttpRequestSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof httpRequestBlockSchema>>
) => {
  const context = useContext(BlockCanvasContext);
  function handleHeaderChange(data: Record<string, string>) {
    context?.updateBlockData(props.blockId, {
      headers: data,
    });
  }
  function handleUrlChange(value: string) {
    context?.updateBlockData(props.blockId, {
      url: value,
    });
  }
  function handleMethodChange(value: string | null) {
    if (!value) return;
    context?.updateBlockData(props.blockId, {
      method: value,
    });
  }
  function handleUseParamChange(value: boolean) {
    context?.updateBlockData(props.blockId, {
      useParam: value,
    });
  }
  function handleBodyDataChange(value: string) {
    context?.updateBlockData(props.blockId, {
      body: value,
    });
  }
  return (
    <Stack px={"xs"}>
      <Grid>
        <Grid.Col span={3}>
          <Select
            placeholder="Method"
            description="HTTP Method"
            value={props.blockData.method}
            onChange={handleMethodChange}
            data={[
              { value: "GET", label: "GET" },
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
              { value: "DELETE", label: "DELETE" },
              { value: "PATCH", label: "PATCH" },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          <JsTextInput
            placeholder="https://jsonplaceholder.typicode.com/todos"
            description="URL to make the request to"
            value={props.blockData.url}
            onValueChange={handleUrlChange}
          />
        </Grid.Col>
      </Grid>
      <Stack gap={"xs"}>
        <Text>Edit Headers</Text>
        <Divider />
        {Object.keys(props.blockData.headers).length === 0 && (
          <Text c="gray" size="sm" ta={"center"}>
            No header(s) to display
          </Text>
        )}
        <KVPEditor
          addButtonText="Add Header"
          inputType="js text"
          data={props.blockData.headers || {}}
          onDataChange={handleHeaderChange}
        />
      </Stack>
      <Grid>
        <Grid.Col span={3}>
          <Checkbox
            color="violet"
            label="Use Params"
            description="Use params (previous block output) to pass to the request"
            checked={props.blockData.useParam}
            onChange={(e) => handleUseParamChange(e.currentTarget.checked)}
          />
        </Grid.Col>
        {!props.blockData.useParam && (
          <Grid.Col span={9}>
            <JsTextInput
              placeholder={'{ "key": "value" }'}
              description="Body to pass to the request. Can be JSON string or JS expression"
              value={props.blockData.body}
              onValueChange={handleBodyDataChange}
            />
          </Grid.Col>
        )}
      </Grid>
    </Stack>
  );
};

export default HttpRequest;
