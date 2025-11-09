import React, { useContext, useMemo } from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position, useNodes } from "@xyflow/react";
import { TbMatrix } from "react-icons/tb";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import { arrayOperationsBlockSchema } from "@cbe/blocks";
import z from "zod";
import { BlockTypes } from "@/types/block";
import { Autocomplete, Checkbox, Group, Select, Stack } from "@mantine/core";
import { BlockCanvasContext } from "@/context/blockCanvas";
import JsTextInput from "@/components/editors/jsTextInput";
import { useDebouncedCallback } from "@mantine/hooks";

const ArrayOperations = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbMatrix size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Array Operations"
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

export function ArrayOperationsHelpPanel(
  props: DataSettingsProps<z.infer<typeof arrayOperationsBlockSchema>>
) {
  return <></>;
}

export function ArrayOperationsSettingsPanel(
  props: DataSettingsProps<z.infer<typeof arrayOperationsBlockSchema>>
) {
  const data = props.blockData;
  const { updateBlockData } = useContext(BlockCanvasContext);
  const [value, setValue] = React.useState(data.value);
  const debouncedUpdate = useDebouncedCallback((value: string) => {
    updateBlockData(props.blockId, { value });
  }, 500);

  const availableVariables =
    (useNodes()
      .filter((block) => block.type === BlockTypes.setvar)
      .map((block) => block.data?.key) as string[]) ||
    (useMemo(() => {
      return useNodes()
        .filter((block) => block.type === BlockTypes.setvar)
        .map((block) => block.data?.key);
    }, []) as string[]);

  function onUseParamChange(value: boolean) {
    updateBlockData(props.blockId, { useParamAsInput: value });
  }
  function onDatasourceChange(value: string) {
    updateBlockData(props.blockId, { datasource: value });
  }
  function onOperationChange(value: string | null) {
    if (!value) return;
    updateBlockData(props.blockId, { operation: value });
  }
  function onJsExpressionChange(value: string) {
    debouncedUpdate(value);
    setValue(value);
  }

  return (
    <Stack>
      <Autocomplete
        label="Datasource"
        placeholder="Type to search or enter variable name"
        description="Choose a variable which contains the target array on which operation will be performed"
        data={availableVariables}
        {...props}
        value={data.datasource}
        onChange={onDatasourceChange}
      />
      <Group gap={"xl"}>
        <Select
          label="Operation"
          placeholder="Select an operation"
          description="Select an operation to perform on the array"
          value={data.operation}
          onChange={onOperationChange}
          data={[
            { value: "push", label: "Push" },
            { value: "pop", label: "Pop" },
            { value: "shift", label: "Shift" },
            { value: "unshift", label: "Unshift" },
          ]}
        />
        <Checkbox
          label="Use Param"
          description="Use input parameter as the datasource?"
          checked={props.blockData.useParamAsInput as boolean}
          onChange={(e) => onUseParamChange(e.target.checked)}
        />
      </Group>
      {props.blockData.useParamAsInput === false &&
        (data.operation === "push" || data.operation === "unshift") && (
          <JsTextInput
            label="Value"
            description="Operation is performed on the datasource with this value (can be Js expression !)"
            value={value}
            onValueChange={onJsExpressionChange}
          />
        )}
    </Stack>
  );
}

export default ArrayOperations;
