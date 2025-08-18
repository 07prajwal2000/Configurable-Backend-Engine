import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CustomHandle from "../../handle";
import BaseBlock from "../baseBlock";
import { Position, type NodeProps } from "@xyflow/react";
import type z from "zod";
import type { transformerBlockSchema } from "@cbe/blocks";
import { useState } from "react";
import { JsEditorButton } from "../../editor/jsDialogEditor";
import FieldMapEditor from "../../editor/fieldMapEditor";

interface TransformerBlockProps extends NodeProps {
  data: z.infer<typeof transformerBlockSchema>;
}

const TransformerBlock = (props: TransformerBlockProps) => {
  const [useJs, setUseJs] = useState(props.data.useJs);
  const [fieldMap, setFieldMap] = useState(props.data.fieldMap);
  const [showFieldMapEditor, setShowFieldMapEditor] = useState(false);
  const [jsCode, setJsCode] = useState(props.data.js || "");

  function toggleFieldMapEditor() {
    setShowFieldMapEditor(!showFieldMapEditor);
  }

  return (
    <BaseBlock title="Transformer" {...props}>
      <CustomHandle type="source" position={Position.Bottom} />
      <CustomHandle type="target" position={Position.Top} />
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
            sx={{ p: "2px", my: "3px" }}
            size="small"
          >
            <Typography textAlign={"center"} fontSize={5}>
              Edit Field Map
            </Typography>
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
        defaultMap={props.data.fieldMap}
        onSave={(value) => setFieldMap(value)}
        defaultFields={[]}
      />
    </BaseBlock>
  );
};

export default TransformerBlock;
