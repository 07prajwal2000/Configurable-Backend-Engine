import { Position, useNodeConnections, type NodeProps } from "@xyflow/react";
import BaseBlock from "../baseBlock";
import CustomHandle, { connectionExist } from "../../handle";
import { Grid, Stack, Typography, useTheme } from "@mui/material";
import { z } from "zod";
import type { forLoopBlockSchema } from "@cbe/blocks";

interface ForLoopProps extends NodeProps {
  data: z.infer<typeof forLoopBlockSchema>;
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
  const srcHandleId = `${props.id}-src`;
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
        {typeof value === "string" ? "js" : value}
      </Typography>
    );
  }

  return (
    <BaseBlock {...props} title="For Loop">
      <Stack direction={"column"} gap={0.2}>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Start</Typography>
          </Grid>
          <Grid size={4}>
            <JsOrValue value={props.data.start} />
          </Grid>
        </Grid>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>End</Typography>
          </Grid>
          <Grid size={4}>
            <JsOrValue value={props.data.end} />
          </Grid>
        </Grid>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Step</Typography>
          </Grid>
          <Grid size={4}>
            <JsOrValue value={props.data.step} />
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
        id={srcHandleId}
        isConnectable={!srcConnExist}
      />
      <CustomHandle
        position={Position.Bottom}
        type="source"
        id={executorHandleId}
        isConnectable={!executorConnExist}
      />
    </BaseBlock>
  );
};

export default ForLoopBlock;
