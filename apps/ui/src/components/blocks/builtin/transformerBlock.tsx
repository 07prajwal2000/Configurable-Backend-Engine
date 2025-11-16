import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import CustomHandle, { connectionExist } from "../../handle";
import BaseBlock from "../baseBlock";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type z from "zod";
import type { transformerBlockSchema } from "@fluxify/blocks";
import { useState } from "react";
import { JsEditorButton } from "../../editor/jsDialogEditor";
import FieldMapEditor from "../../editor/fieldMapEditor";
import { useBlocksContext } from "../../editor/blockEditor";
import BaseBlockSidebar from "../../editor/baseBlockSidebar";

interface TransformerBlockProps extends NodeProps {
  data: z.infer<typeof transformerBlockSchema>;
}

export function TransformerBlockSidebar({ block }: { block: Node }) {
  const { fieldMap, js, useJs } = block.data as z.infer<
    typeof transformerBlockSchema
  >;
  const [mapEditorOpened, setMapEditorOpened] = useState(false);
  const { updateBlockData } = useBlocksContext();

  function toggleEditor() {
    setMapEditorOpened((p) => !p);
  }
  function onFieldMapChange(value: Record<string, any>) {
    updateBlockData(block.id, {
      fieldMap: value,
      js,
      useJs,
    });
  }
  function onJsChange(value: string) {
    updateBlockData(block.id, {
      js: value,
      useJs,
      fieldMap,
    });
  }
  function onUseJsChange(value: boolean) {
    updateBlockData(block.id, {
      useJs: value,
      fieldMap,
      js,
    });
  }

  return (
    <BaseBlockSidebar showConnections block={block}>
      <Box>
        <FormControlLabel
          sx={{
            mx: 0,
            px: 0,
          }}
          labelPlacement="start"
          control={
            <Checkbox
              checked={useJs}
              onChange={(e) => onUseJsChange(e.target.checked)}
            />
          }
          label="Use JS?"
        />
      </Box>
      {useJs ? (
        <JsEditorButton
          defaultValue={js}
          onSave={onJsChange}
          title="Edit Javascript"
        />
      ) : (
        <Button color="info" variant="outlined" onClick={toggleEditor}>
          Edit Field Map
        </Button>
      )}
      <FieldMapEditor
        defaultMap={fieldMap}
        onSave={onFieldMapChange}
        open={mapEditorOpened}
        onClose={toggleEditor}
      />
    </BaseBlockSidebar>
  );
}

const TransformerBlock = (props: TransformerBlockProps) => {
  const { useJs, fieldMap, js } = props.data;
  const [showFieldMapEditor, setShowFieldMapEditor] = useState(false);
  const { updateBlockData } = useBlocksContext();
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

  function setUseJs(value: boolean) {
    updateBlockData(props.id, {
      fieldMap,
      js,
      useJs: value,
    });
  }
  function setFieldMap(value: Record<string, any>) {
    updateBlockData(props.id, {
      fieldMap: value,
      js,
      useJs,
    });
  }
  function setJsCode(value: string) {
    updateBlockData(props.id, {
      fieldMap,
      js: value,
      useJs,
    });
  }

  function toggleFieldMapEditor() {
    setShowFieldMapEditor(!showFieldMapEditor);
  }

  return (
    <BaseBlock title="Transformer" {...props}>
      <CustomHandle
        id={srcHandleId}
        isConnectable={!srcConnExist}
        type="source"
        position={Position.Bottom}
      />
      <CustomHandle
        isConnectable={!targetConnExist}
        id={targetHandleId}
        type="target"
        position={Position.Top}
      />
      <Stack
        direction={"column"}
        justifyContent={"space-around"}
        width={"100%"}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <Typography fontSize={6}>Use JS?</Typography>
          <input
            checked={useJs}
            onChange={(e) => setUseJs(e.target.checked)}
            type="checkbox"
            style={{
              height: "10px",
              width: "10px",
            }}
          />
        </Stack>
        {!useJs && (
          <Button
            onClick={toggleFieldMapEditor}
            variant="outlined"
            color="info"
            fullWidth
            sx={{ p: "2px", my: "3px", fontSize: 5 }}
            size="small"
          >
            Edit Field Map
          </Button>
        )}
        {useJs && (
          <JsEditorButton
            buttonSx={{ fontSize: 5, p: "2px" }}
            title="Edit Javascript"
            defaultValue={js}
            onSave={setJsCode}
          />
        )}
      </Stack>
      <FieldMapEditor
        open={showFieldMapEditor}
        onClose={toggleFieldMapEditor}
        defaultMap={fieldMap}
        onSave={setFieldMap}
        defaultFields={[]}
      />
    </BaseBlock>
  );
};

export default TransformerBlock;
