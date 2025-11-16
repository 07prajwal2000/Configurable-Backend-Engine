import React, { useContext } from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbInfinity } from "react-icons/tb";
import {
  Alert,
  NumberInput,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import z from "zod";
import { forLoopBlockSchema } from "@fluxify/blocks";
import DebouncedTextInput from "@/components/editors/debouncedTextInput";
import { BlockCanvasContext } from "@/context/blockCanvas";
import JsTextInput from "@/components/editors/jsTextInput";

const Forloop = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbInfinity color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="For"
      labelPlacement="left"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        color="green"
        position={Position.Right}
        handleVariant="executor"
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export const ForloopHelpPanel = (
  props: DataSettingsProps<z.infer<typeof forLoopBlockSchema>>
) => {
  return <></>;
};

export const ForloopSettingsPanel = (
  props: DataSettingsProps<z.infer<typeof forLoopBlockSchema>>
) => {
  const { updateBlockData } = useContext(BlockCanvasContext);
  const { start, end, step } = props.blockData;
  const isAnyValueJs =
    typeof start === "string" ||
    typeof end === "string" ||
    typeof step === "string";

  const isInfiniteLoop = React.useMemo(() => {
    if (
      typeof step !== "number" ||
      typeof start !== "number" ||
      typeof end !== "number"
    )
      return false;
    // If step is 0, it's always an infinite loop
    if (step === 0) return true;

    // If start < end but step is negative, it will never reach end
    if (start < end && step < 0) return true;

    // If start > end but step is positive, it will never reach end
    if (start > end && step > 0) return true;

    return false;
  }, [start, end, step]);

  function onStart(value: string | number) {
    if (value === "") value = 1;
    const num = +value;
    updateBlockData(props.blockId, {
      start: isNaN(num) ? value : num,
    });
  }
  function onEnd(value: string | number) {
    if (value === "") value = 10;
    const num = +value;
    updateBlockData(props.blockId, { end: isNaN(num) ? value : num });
  }
  function onStep(value: string | number) {
    if (value === "") value = 1;
    const num = +value;
    updateBlockData(props.blockId, { step: isNaN(num) ? value : num });
  }

  return (
    <Stack>
      <JsTextInput
        label="Start"
        value={start}
        onValueChange={(value) => onStart(value)}
      />
      <JsTextInput
        label="End"
        value={end}
        onValueChange={(value) => onEnd(value)}
      />
      <JsTextInput
        label="Step"
        value={step}
        onValueChange={(value) => onStep(value)}
      />
      {(isInfiniteLoop || isAnyValueJs) && (
        <Alert title="Warning !" color="yellow">
          {isInfiniteLoop
            ? "Loop might be infinite, careful with the values"
            : "Careful with Js expressions, they can be unsafe if not used carefully"}
        </Alert>
      )}
    </Stack>
  );
};

export default Forloop;
