import type z from "zod";
import BaseBlock from "../baseBlock";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type { forEachLoopBlockSchema } from "@cbe/blocks";
import CustomHandle, { connectionExist } from "../../handle";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import ListEditor from "../../editor/listEditor";
import { useBlocksContext } from "../../editor/blockEditor";
import BaseBlockSidebar from "../../editor/baseBlockSidebar";

interface ForeachLoopBlockProps extends NodeProps {
  data: z.infer<typeof forEachLoopBlockSchema>;
}

const ForeachLoopBlock = (props: ForeachLoopBlockProps) => {
  const warnColor = useTheme().palette.warning;
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
  const [popupOpened, setPopupOpened] = useState(false);
  const { updateBlockData } = useBlocksContext();

  function toggleEditValues() {
    setPopupOpened(!popupOpened);
  }
  function onSave(value?: any[], useParam?: boolean) {
    updateBlockData(props.id, {
      useParam,
      values: value || props.data.values,
    });
  }

  return (
    <BaseBlock title="For Each" {...props}>
      <Box>
        <CustomHandle
          isConnectable={!targetConnExist}
          id={targetHandleId}
          position={Position.Top}
          type="target"
        />
        <CustomHandle
          position={Position.Bottom}
          type="source"
          id={executorHandleId}
          isConnectable={!executorConnExist}
        />
        <CustomHandle
          isConnectable={!srcConnExist}
          id={srcHandleId}
          position={Position.Right}
          bgColor={warnColor.light}
          type="source"
        />
      </Box>
      <Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography fontSize={6}>Use Param?</Typography>
          <input
            checked={props.data.useParam}
            onChange={(e) => onSave(undefined, e.target.checked)}
            type="checkbox"
            style={{
              height: "10px",
              width: "10px",
            }}
          />
        </Stack>

        <Button
          onClick={toggleEditValues}
          variant="outlined"
          color="info"
          fullWidth
          sx={{ p: "2px", my: "3px", fontSize: 5 }}
          disabled={props.data.useParam}
          size="small"
        >
          Edit Values
        </Button>
      </Stack>
      <ListEditor
        open={popupOpened}
        onClose={() => setPopupOpened(false)}
        title="Edit List Values"
        values={props.data.values || []}
        onSave={onSave}
      />
    </BaseBlock>
  );
};

export function ForeachLoopBlockSidebar({ block }: { block: Node }) {
  const [popupOpened, setPopupOpened] = useState(false);
  const { updateBlockData } = useBlocksContext();

  function toggleEditValues() {
    setPopupOpened(!popupOpened);
  }
  function onSave(value?: any[], useParam?: boolean) {
    updateBlockData(block.id, {
      useParam,
      values: value || block.data.values,
    });
  }

  return (
    <BaseBlockSidebar block={block} showConnections>
      <Box>
        <FormControlLabel
          sx={{
            mx: 0,
            px: 0,
          }}
          labelPlacement="start"
          control={
            <Checkbox
              checked={block.data.useParam as boolean}
              onChange={(e) => onSave(undefined, e.target.checked)}
            />
          }
          label="Use Param?"
        />
      </Box>
      <Button
        onClick={toggleEditValues}
        variant="outlined"
        color="info"
        disabled={block.data.useParam as boolean}
        fullWidth
        size="small"
      >
        Edit Values
      </Button>
      <ListEditor
        open={popupOpened}
        onClose={() => setPopupOpened(false)}
        title="Edit List Values"
        values={(block.data.values as string[]) || []}
        onSave={onSave}
      />
    </BaseBlockSidebar>
  );
}

export default ForeachLoopBlock;
