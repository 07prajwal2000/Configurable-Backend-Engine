import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import BaseBlock from "../../baseBlock";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import CustomHandle, { connectionExist } from "../../../handle";
import type z from "zod";
import { logBlockSchema } from "@fluxify/blocks/builtin/log";
import BaseBlockSidebar from "../../../editor/baseBlockSidebar";
import InputWithJs from "../../../inputWithJs";
import { useBlocksContext } from "../../../editor/blockEditor";

interface ConsoleLogBlockProps extends NodeProps {
  data: z.infer<typeof logBlockSchema>;
}

export function ConsoleLogBlockSidebar({ block }: { block: Node }) {
  const { updateBlockData } = useBlocksContext();
  const { level, message } = block.data as z.infer<typeof logBlockSchema>;

  function onMsgChange(value: string) {
    updateBlockData(block.id, {
      message: value,
      level,
    });
  }
  function onLevelChange(value: string) {
    updateBlockData(block.id, {
      level: value,
      message,
    });
  }

  return (
    <BaseBlockSidebar block={block} showConnections>
      <InputWithJs label="Log Message" value={message} onChange={onMsgChange} />
      <FormControl>
        <InputLabel id="level-label">Log Level</InputLabel>
        <Select
          labelId="level-label"
          value={level}
          size="small"
          variant="outlined"
          label={"Log Level"}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          <MenuItem value="info">Info</MenuItem>
          <MenuItem value="warn">Warn</MenuItem>
          <MenuItem value="error">Error</MenuItem>
        </Select>
      </FormControl>
    </BaseBlockSidebar>
  );
}

const ConsoleLogBlock = (props: ConsoleLogBlockProps) => {
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
    <BaseBlock {...props} title="Console Log">
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
      <Grid container direction={"row"} mt={0.5} gap={1} alignItems={"center"}>
        <Grid size={2}>
          <Typography fontSize={6}>Level</Typography>
        </Grid>
        <Grid
          size={4}
          sx={{
            border: `1px solid ${primaryColor.main}`,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography fontSize={6} textTransform={"uppercase"}>
            {props.data.level}
          </Typography>
        </Grid>
      </Grid>
    </BaseBlock>
  );
};

export default ConsoleLogBlock;
