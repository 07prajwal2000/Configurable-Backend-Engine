import type { getHttpCookieBlockSchema } from "@fluxify/blocks";
import { Stack, Grid, Typography, useTheme, TextField } from "@mui/material";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type z from "zod";
import CustomHandle, { connectionExist } from "../../../handle";
import BaseBlock from "../../baseBlock";
import { useBlocksContext } from "../../../editor/blockEditor";
import BaseBlockSidebar from "../../../editor/baseBlockSidebar";

export function GetHttpCookieBlockSidebar({ block }: { block: Node }) {
  const data = block.data as z.infer<typeof getHttpCookieBlockSchema>;
  const { updateBlockData } = useBlocksContext();

  function onNameChange(value: string) {
    updateBlockData(block.id, {
      name: value,
    });
  }

  return (
    <BaseBlockSidebar block={block} showConnections>
      <TextField
        label="Cookie Name"
        value={data.name || ""}
        size="small"
        onChange={(e) => onNameChange(e.target.value)}
      />
    </BaseBlockSidebar>
  );
}

const GetHttpCookieBlock = (props: NodeProps) => {
  const data = props.data as z.infer<typeof getHttpCookieBlockSchema>;
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
    <BaseBlock {...props} title="Get Cookie">
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
      </Stack>
    </BaseBlock>
  );
};

export default GetHttpCookieBlock;
