import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import BaseBlock from "../baseBlock";
import CustomHandle, { connectionExist } from "../../handle";
import { Grid, Stack, Typography, useTheme } from "@mui/material";
import { z } from "zod";
import type { forLoopBlockSchema } from "@fluxify/blocks";
import BaseBlockSidebar from "../../editor/baseBlockSidebar";
import { useBlocksContext } from "../../editor/blockEditor";
import InputWithJs from "../../inputWithJs";

interface ForLoopProps extends NodeProps {
  data: z.infer<typeof forLoopBlockSchema>;
}

export function ForLoopBlockSidebar({ block }: { block: Node }) {
  const { updateBlockData } = useBlocksContext();
  const data = block.data as z.infer<typeof forLoopBlockSchema>;
  const isValueError =
    !isNaN(data.start as number) &&
    !isNaN(data.end as number) &&
    data.start > data.end;

  function onStartChange(value: string) {
    updateBlockData(block.id, {
      ...data,
      start: value,
    });
  }
  function onEndChange(value: string) {
    updateBlockData(block.id, {
      ...data,
      end: value,
    });
  }
  function onStepChange(value: string) {
    updateBlockData(block.id, {
      ...data,
      step: value,
    });
  }

  return (
    <BaseBlockSidebar showConnections block={block}>
      <InputWithJs
        type="number"
        error={isValueError}
        value={data.start.toString()}
        onChange={onStartChange}
        label="Start"
      />
      <InputWithJs
        type="number"
        error={isValueError}
        value={data.end.toString()}
        onChange={onEndChange}
        label="End"
      />
      <InputWithJs
        type="number"
        error={isValueError}
        value={data.step.toString()}
        onChange={onStepChange}
        label="Step"
      />
    </BaseBlockSidebar>
  );
}

const ForLoopBlock = (props: ForLoopProps) => {
  const connections = useNodeConnections({
    id: props.id,
  });
  const targetHandleId = `${props.id}-target`;
  const targetConnExist = connectionExist(
    targetHandleId,
    "target",
    connections
  );
  const srcHandleId = `${props.id}-source`;
  const srcConnExist = connectionExist(srcHandleId, "source", connections);
  const executorHandleId = `${props.id}-executor`;
  const executorConnExist = connectionExist(
    executorHandleId,
    "source",
    connections
  );
  const warnColor = useTheme().palette.warning;
  const primaryColor = useTheme().palette.info;

  function JsOrValue({ value }: { value: string | number }) {
    const isJs = typeof value == "string" && value.startsWith("js:");
    return (
      <Typography
        fontSize={6}
        sx={{
          textAlign: "center",
          border: 1,
          px: 1,
          borderRadius: 1,
          borderColor: primaryColor.main,
        }}
      >
        {isJs ? "js" : value}
      </Typography>
    );
  }

  function valueOrNil(value: any) {
    if (value !== "") {
      return value;
    }
    return "-";
  }

  return (
    <BaseBlock {...props} title="For Loop">
      <Stack mt={0.5} direction={"column"} gap={0.2}>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Start</Typography>
          </Grid>
          <Grid size={4}>
            <JsOrValue value={valueOrNil(props.data.start)} />
          </Grid>
        </Grid>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>End</Typography>
          </Grid>
          <Grid size={4}>
            <JsOrValue value={valueOrNil(props.data.end)} />
          </Grid>
        </Grid>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Step</Typography>
          </Grid>
          <Grid size={4}>
            <JsOrValue value={valueOrNil(props.data.step)} />
          </Grid>
        </Grid>
      </Stack>
      <CustomHandle
        position={Position.Top}
        type="target"
        id={targetHandleId}
        isConnectable={!targetConnExist}
      />
      <CustomHandle
        bgColor={warnColor.light}
        position={Position.Right}
        type="source"
        id={executorHandleId}
        isConnectable={!executorConnExist}
      />
      <CustomHandle
        position={Position.Bottom}
        type="source"
        id={srcHandleId}
        isConnectable={!srcConnExist}
      />
    </BaseBlock>
  );
};

export default ForLoopBlock;
