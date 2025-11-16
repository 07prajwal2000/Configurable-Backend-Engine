import { Grid, TextField, Typography, useTheme } from "@mui/material";
import BaseBlock from "../../baseBlock";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type z from "zod";
import type { getHttpHeaderBlockSchema } from "@fluxify/blocks";
import BaseBlockSidebar from "../../../editor/baseBlockSidebar";
import { useBlocksContext } from "../../../editor/blockEditor";
import CustomHandle, { connectionExist } from "../../../handle";

interface GetHttpRequestHeaderBlockProps extends NodeProps {}

export function GetHttpRequestHeaderBlockSidebar({ block }: { block: Node }) {
  const data = block.data as z.infer<typeof getHttpHeaderBlockSchema>;
  const { updateBlockData } = useBlocksContext();

  function onChange(value: string) {
    updateBlockData(block.id, {
      name: value,
    });
  }

  return (
    <BaseBlockSidebar block={block} showConnections>
      <TextField
        label="Header Name"
        value={data.name || ""}
        size="small"
        onChange={(e) => onChange(e.target.value)}
      />
    </BaseBlockSidebar>
  );
}

const GetHttpRequestHeaderBlock = (props: GetHttpRequestHeaderBlockProps) => {
  const primaryColor = useTheme().palette.primary;
  const data = props.data as z.infer<typeof getHttpHeaderBlockSchema>;
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
    </BaseBlock>
  );
};

export default GetHttpRequestHeaderBlock;
