import type z from "zod";
import BaseBlock from "../baseBlock";
import { Position, useNodeConnections, type NodeProps } from "@xyflow/react";
import type { forEachLoopBlockSchema } from "@cbe/blocks";
import CustomHandle, { connectionExist } from "../../handle";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ListEditor from "../../editor/listEditor";
import { useBlockDataUpdater } from "../../editor/blockEditor";

interface ForeachLoopBlockProps extends NodeProps {
  data: z.infer<typeof forEachLoopBlockSchema>;
}

const ForeachLoopBlock = (props: ForeachLoopBlockProps) => {
  const initialRender = useRef(false);
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
  const srcHandleId = `${props.id}-src`;
  const srcConnExist = connectionExist(srcHandleId, "source", connections);
  const executorHandleId = `${props.id}-executor`;
  const executorConnExist = connectionExist(
    executorHandleId,
    "source",
    connections
  );
  const [popupOpened, setPopupOpened] = useState(false);
  const [useParam, setUseParam] = useState(props.data.useParam || false);
  const { updateBlockData } = useBlockDataUpdater();

  useEffect(() => {
    if (!initialRender.current) {
      initialRender.current = true;
      return;
    }
    onSave();
  }, [useParam]);
  function toggleEditValues() {
    setPopupOpened(!popupOpened);
  }
  function onSave(value?: any[]) {
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
            checked={useParam}
            onChange={(e) => setUseParam(e.target.checked)}
            type="checkbox"
            style={{
              height: "10px",
              width: "10px",
            }}
          />
        </Stack>

        {!useParam && (
          <Button
            onClick={toggleEditValues}
            variant="outlined"
            color="info"
            fullWidth
            sx={{ p: "2px", my: "3px", fontSize: 5 }}
            size="small"
          >
            Edit Values
          </Button>
        )}
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

export default ForeachLoopBlock;
