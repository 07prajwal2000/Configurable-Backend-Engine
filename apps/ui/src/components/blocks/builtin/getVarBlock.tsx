import { Grid, TextField, Typography, useTheme } from "@mui/material";
import CustomHandle, { connectionExist } from "../../handle";
import BaseBlock from "../baseBlock";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import BaseBlockSidebar from "../../editor/baseBlockSidebar";
import { useBlocksContext } from "../../editor/blockEditor";

interface GetVarBlockProps extends NodeProps {
  data: {
    key: string;
  };
}

export function GetVarBlockSidebar({ block }: { block: Node }) {
  const { key } = block.data;
  const { updateBlockData } = useBlocksContext();

  const handleKeyChange = (value: string) => {
    updateBlockData(block.id, { key: value });
  };

  return (
    <BaseBlockSidebar block={block} showConnections>
      <TextField
        size={"small"}
        label="Key"
        value={key}
        onChange={(e) => handleKeyChange(e.target.value)}
      />
    </BaseBlockSidebar>
  );
}

const GetVarBlock = (props: GetVarBlockProps) => {
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
    <BaseBlock {...props} title="Get Variable">
      <CustomHandle
        isConnectable={!targetConnExist}
        type="target"
        id={targetHandleId}
        position={Position.Top}
      />
      <CustomHandle
        isConnectable={!srcConnExist}
        id={srcHandleId}
        type="source"
        position={Position.Bottom}
      />
      <Grid container mt={0.5} direction={"row"} gap={1} alignItems={"center"}>
        <Grid size={2}>
          <Typography fontSize={6}>Key</Typography>
        </Grid>
        <Grid
          size={4}
          sx={{
            border: `1px solid ${primaryColor.main}`,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography fontSize={6}>{props.data.key || "."}</Typography>
        </Grid>
      </Grid>
    </BaseBlock>
  );
};

export default GetVarBlock;
