import type { setHttpHeaderBlockSchema } from "@cbe/blocks";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type z from "zod";
import BaseBlock from "../../baseBlock";
import { Grid, Stack, TextField, Typography, useTheme } from "@mui/material";
import CustomHandle, { connectionExist } from "../../../handle";
import BaseBlockSidebar from "../../../editor/baseBlockSidebar";
import { useBlocksContext } from "../../../editor/blockEditor";
import InputWithJs from "../../../inputWithJs";

interface SetHttpHeaderBlockProps extends NodeProps {
  data: z.infer<typeof setHttpHeaderBlockSchema>;
}

export function SetHttpRequestHeaderBlockSidebar({ block }: { block: Node }) {
  const data = block.data as z.infer<typeof setHttpHeaderBlockSchema>;
  const { updateBlockData } = useBlocksContext();

  function onNameChange(value: string) {
    updateBlockData(block.id, {
      name: value,
    });
  }

  function onValueChange(value: string) {
    updateBlockData(block.id, {
      value,
    });
  }

  return (
    <BaseBlockSidebar block={block} showConnections>
      <TextField
        label="Header Name"
        value={data.name || ""}
        size="small"
        onChange={(e) => onNameChange(e.target.value)}
      />
      <InputWithJs
        label="Header Value"
        value={data.value || ""}
        onChange={onValueChange}
        size="small"
      />
    </BaseBlockSidebar>
  );
}

const SetHttpHeaderBlock = (props: SetHttpHeaderBlockProps) => {
  const data = props.data as z.infer<typeof setHttpHeaderBlockSchema>;
  const primaryColor = useTheme().palette.primary;
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
  let value = data.value;

  if (value?.startsWith("js:")) value = "js";

  return (
    <BaseBlock {...props} title="Get HTTP Header">
      <CustomHandle
        id={targetHandleId}
        isConnectable={!targetConnExist}
        type="target"
        position={Position.Top}
      />
      <CustomHandle
        id={srcHandleId}
        isConnectable={!srcConnExist}
        type="source"
        position={Position.Bottom}
      />

      <Stack direction={"column"} gap={0.5}>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Name</Typography>
          </Grid>
          <Grid size={4}>
            <Typography
              fontSize={6}
              sx={{
                textAlign: "center",
                textOverflow: "ellipsis",
                border: 1,
                px: 1,
                borderRadius: 1,
                width: "40px",
                borderColor: primaryColor.main,
              }}
            >
              {data.name || "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Value</Typography>
          </Grid>
          <Grid size={4}>
            <Typography
              fontSize={6}
              sx={{
                textAlign: "center",
                textOverflow: "ellipsis",
                border: 1,
                px: 1,
                borderRadius: 1,
                width: "40px",
                borderColor: primaryColor.main,
              }}
            >
              {value}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </BaseBlock>
  );
};

export default SetHttpHeaderBlock;
