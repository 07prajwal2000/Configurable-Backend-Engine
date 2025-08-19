import { Button, Stack, Typography } from "@mui/material";
import CustomHandle from "../../handle";
import BaseBlock from "../baseBlock";
import { Position, type NodeProps } from "@xyflow/react";
import type z from "zod";
import type { transformerBlockSchema } from "@cbe/blocks";
import { useEffect, useRef, useState } from "react";
import { JsEditorButton } from "../../editor/jsDialogEditor";
import FieldMapEditor from "../../editor/fieldMapEditor";
import { useBlockDataUpdater } from "../../editor/blockEditor";

interface TransformerBlockProps extends NodeProps {
  data: z.infer<typeof transformerBlockSchema>;
}

const TransformerBlock = (props: TransformerBlockProps) => {
  const initialRenderedRef = useRef(false);
  const [useJs, setUseJs] = useState(props.data.useJs);
  const [fieldMap, setFieldMap] = useState(props.data.fieldMap);
  const [showFieldMapEditor, setShowFieldMapEditor] = useState(false);
  const [jsCode, setJsCode] = useState(props.data.js || "");
  const { updateBlockData } = useBlockDataUpdater();
  useEffect(() => {
    if (!initialRenderedRef.current) {
      initialRenderedRef.current = true;
      return;
    }
    updateBlockData(props.id, {
      useJs: useJs,
      fieldMap: fieldMap,
      js: jsCode,
    });
  }, [useJs, fieldMap, jsCode]);

  function toggleFieldMapEditor() {
    setShowFieldMapEditor(!showFieldMapEditor);
  }

  function onSave(value: Record<string, string>) {
    setFieldMap(value);
  }

  return (
    <BaseBlock title="Transformer" {...props}>
      <CustomHandle
        id={`${props.id}-source`}
        type="source"
        position={Position.Bottom}
      />
      <CustomHandle
        id={`${props.id}-target`}
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
            defaultValue={props.data.js}
            onSave={(value) => setJsCode(value)}
          />
        )}
      </Stack>
      <FieldMapEditor
        open={showFieldMapEditor}
        onClose={toggleFieldMapEditor}
        defaultMap={fieldMap}
        onSave={onSave}
        defaultFields={[]}
      />
    </BaseBlock>
  );
};

export default TransformerBlock;
