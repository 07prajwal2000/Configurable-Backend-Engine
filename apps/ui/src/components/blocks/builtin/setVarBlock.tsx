import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import BaseBlock from "../baseBlock";
import type z from "zod";
import type { setVarSchema } from "@fluxify/blocks";
import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CustomHandle, { connectionExist } from "../../handle";
import BaseBlockSidebar from "../../editor/baseBlockSidebar";
import { useBlocksContext } from "../../editor/blockEditor";
import InputWithJs from "../../inputWithJs";

interface SetVarProps extends NodeProps {
  data: z.infer<typeof setVarSchema>;
}

export function SetVarBlockSidebar({ block }: { block: Node }) {
  const { key, value } = block.data;
  const { updateBlockData } = useBlocksContext();

  function handleKeyChange(value: string) {
    updateBlockData(block.id, {
      ...block.data,
      key: value,
    });
  }

  function handleValueChange(value: string) {
    updateBlockData(block.id, {
      ...block.data,
      value: value,
    });
  }

  return (
    <BaseBlockSidebar block={block} showConnections>
      <TextField
        size={"small"}
        label="Key"
        value={key}
        onChange={(e) => handleKeyChange(e.target.value)}
      />
      <InputWithJs
        size={"small"}
        label="Value"
        value={value as string}
        onChange={handleValueChange}
      />
    </BaseBlockSidebar>
  );
}

const SetVarBlock = (props: SetVarProps) => {
  const connections = useNodeConnections({
    id: props.id,
  });
  const primaryColor = useTheme().palette.primary;
  const targetHandleId = `${props.id}-target`;
  const targetConnExist = connectionExist(
    targetHandleId,
    "target",
    connections
  );
  const srcHandleId = `${props.id}-source`;
  const srcConnExist = connectionExist(srcHandleId, "source", connections);

  return (
    <BaseBlock {...props} title="Set Variable">
      <Box>
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
      </Box>
      <Stack direction={"column"} gap={0.2}>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Name</Typography>
          </Grid>
          <Grid size={4}>
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
              {props.data.key || "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          mb={0.6}
          container
          direction={"row"}
          gap={1}
          alignItems={"center"}
        >
          <Grid size={3}>
            <Typography fontSize={6}>Value</Typography>
          </Grid>
          <Grid size={4}>
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
              {typeof props.data.value === "string" &&
              props.data.value.startsWith("js:")
                ? "js"
                : props.data.value || "-"}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </BaseBlock>
  );
};

export default SetVarBlock;
