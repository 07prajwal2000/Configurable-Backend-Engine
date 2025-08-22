import type { getHttpParamBlockSchema } from "@cbe/blocks";
import {
  Stack,
  Grid,
  Typography,
  useTheme,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  useNodeConnections,
  Position,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import type z from "zod";
import CustomHandle, { connectionExist } from "../../../handle";
import BaseBlock from "../../baseBlock";
import { useBlocksContext } from "../../../editor/blockEditor";
import BaseBlockSidebar from "../../../editor/baseBlockSidebar";

export function GetHttpParamBlockSidebar({ block }: { block: Node }) {
  const data = block.data as z.infer<typeof getHttpParamBlockSchema>;
  const { updateBlockData } = useBlocksContext();

  function onNameChange(value: string) {
    updateBlockData(block.id, {
      name: value,
    });
  }

  function onSourceChange(value: string) {
    updateBlockData(block.id, {
      source: value,
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
      <FormControl fullWidth>
        <InputLabel id="samesite">Same Site</InputLabel>
        <Select
          labelId="samesite"
          id="samesite-input"
          size="small"
          value={data.source || "path"}
          label="Same Site"
          onChange={(e) => onSourceChange(e.target.value)}
        >
          <MenuItem value={"path"}>Path</MenuItem>
          <MenuItem value={"query"}>Query</MenuItem>
        </Select>
      </FormControl>
    </BaseBlockSidebar>
  );
}

const GetHttpParamBlock = (props: NodeProps) => {
  const data = props.data as z.infer<typeof getHttpParamBlockSchema>;
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

  return (
    <BaseBlock {...props} title="Get HTTP Param">
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
            <Typography fontSize={6}>Source</Typography>
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
              {data.source}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </BaseBlock>
  );
};

export default GetHttpParamBlock;
