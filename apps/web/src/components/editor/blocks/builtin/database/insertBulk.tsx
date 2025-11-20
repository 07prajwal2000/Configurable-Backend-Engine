import React, { useContext } from "react";
import { TbDatabasePlus, TbInfoCircle } from "react-icons/tb";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import BlockHandle from "../../handle";
import {
  Alert,
  Button,
  ButtonGroup,
  Checkbox,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { insertBulkDbBlockSchema } from "@fluxify/blocks";
import z from "zod";
import IntegrationSelector from "@/components/editors/integrationSelector";
import { BlockCanvasContext } from "@/context/blockCanvas";
import JsTextInput from "@/components/editors/jsTextInput";
import {
  JsonEditor,
  OpenJsonEditorButton,
} from "@/components/editors/jsonEditor";
import JsEditor from "@/components/editors/jsEditor";

const InsertBulk = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={
        <>
          <TbDatabasePlus size={15} />
          <Text
            style={{
              position: "absolute",
              bottom: "-3px",
              right: "-5px",
              fontSize: "8px",
            }}
            fw={500}
            c="dark"
          >
            ...
          </Text>
        </>
      }
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Insert Bulk Record"
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

export function InsertBulkSettingsPanel(props: {
  blockId: string;
  blockData: z.infer<typeof insertBulkDbBlockSchema>;
}) {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onIntegrationSelect(id: string) {
    updateBlockData(props.blockId, {
      connection: id,
    });
  }
  function onTableNameChange(value: string) {
    updateBlockData(props.blockId, {
      tableName: value,
    });
  }
  function onUseParamChange(value: boolean) {
    updateBlockData(props.blockId, {
      useParam: value,
    });
  }
  function onDataSourceChange(value: string) {
    updateBlockData(props.blockId, {
      data: {
        source: value,
        value: props.blockData.data.value,
      },
    });
  }
  function onRawValueChange(value: any) {
    updateBlockData(props.blockId, {
      data: {
        source: "raw",
        value,
      },
    });
  }
  function onJsValueChange(value: string) {
    updateBlockData(props.blockId, {
      data: {
        source: "js",
        value,
      },
    });
  }
  function onRawDataSourceChange() {
    onDataSourceChange("raw");
  }
  function onJsDataSourceChange() {
    onDataSourceChange("js");
  }
  return (
    <Stack px={"xs"}>
      <IntegrationSelector
        group="database"
        label="Choose Database Connection"
        description="Select the database connection to use for this block"
        selectedIntegration={props.blockData.connection}
        onSelect={onIntegrationSelect}
      />
      <Group>
        <JsTextInput
          flex={2}
          label="Table Name"
          description="Enter the table name to get the single record from or a JS expression that returns the table name"
          value={props.blockData.tableName}
          onValueChange={onTableNameChange}
        />
        <Checkbox
          flex={1}
          label="Use Parameter"
          description="Use the data from the previous block as the data to insert"
          color="violet"
          checked={props.blockData.useParam}
          onChange={(e) => onUseParamChange(e.currentTarget.checked)}
        />
      </Group>
      {!props.blockData.useParam && (
        <ButtonGroup>
          <Button
            fullWidth
            variant={
              props.blockData.data.source === "raw" ? "filled" : "outline"
            }
            color="violet"
            onClick={onRawDataSourceChange}
          >
            Raw
          </Button>
          <Button
            fullWidth
            variant={
              props.blockData.data.source === "js" ? "filled" : "outline"
            }
            color="violet"
            onClick={onJsDataSourceChange}
          >
            JS
          </Button>
        </ButtonGroup>
      )}
      {props.blockData.data.source === "raw" && !props.blockData.useParam && (
        <OpenJsonEditorButton
          variant="outline"
          label="Edit JSON Data"
          onSave={onRawValueChange}
          rootValueType="array"
          defaultValue={props.blockData.data.value}
        />
      )}
      {props.blockData.data.source === "js" && !props.blockData.useParam && (
        <>
          <Alert p={"xs"} icon={<TbInfoCircle size={20} />}>
            <Text size="sm">
              Return an array of objects to insert into the database
            </Text>
          </Alert>
          <JsEditor
            height={200}
            defaultValue={
              typeof props.blockData.data.value === "string"
                ? props.blockData.data.value
                : ""
            }
            onChange={onJsValueChange}
          />
        </>
      )}
    </Stack>
  );
}

export default InsertBulk;
