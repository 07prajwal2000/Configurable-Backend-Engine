import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CodeEditor from "./codeEditor";
import { useState } from "react";

type JsDialogEditorProps = {
  open: boolean;
  onClose?: () => void;
  onSave?: (value: string) => void;
  title?: string;
  defaultValue?: string;
};

const JsDialogEditor = (props: JsDialogEditorProps) => {
  const [jsCode, setjsCode] = useState(props.defaultValue || "");

  function onSaveClicked() {
    props.onSave && props.onSave(jsCode);
  }

  function onChange(value: string) {
    setjsCode(value);
  }

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent sx={{ minWidth: 550, minHeight: 350 }}>
        <CodeEditor height={350} onChange={onChange} value={jsCode} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSaveClicked} variant="outlined">
          Save
        </Button>
        <Button onClick={props.onClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export function JsEditorButton(props: Omit<JsDialogEditorProps, "open">) {
  const [open, setOpen] = useState(false);
  function toggleOpen() {
    setOpen(!open);
  }

  function onSave(value: string) {
    console.log(value);
    setOpen(false);
    // props.onSave && props.onSave(value);
  }
  return (
    <Box>
      <Button onClick={toggleOpen} color="info" variant="outlined" fullWidth>
        {props.title}
      </Button>
      <JsDialogEditor
        open={open}
        onClose={toggleOpen}
        title={props.title}
        defaultValue={props.defaultValue}
        onSave={onSave}
      />
    </Box>
  );
}

export default JsDialogEditor;
