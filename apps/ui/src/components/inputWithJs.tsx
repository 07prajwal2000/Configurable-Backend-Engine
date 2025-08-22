import {
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  useTheme,
  type BaseTextFieldProps,
} from "@mui/material";
import { useEffect, useId, useState } from "react";
import { IoLogoJavascript } from "react-icons/io5";
import JsDialogEditor from "./editor/jsDialogEditor";

interface Props extends BaseTextFieldProps {
  onChange?: (value: string) => void;
  value?: string | number;
}

const InputWithJs = (props: Props) => {
  const id = useId();
  const [showJsModal, setShowJsModal] = useState(false);
  const [value, setValue] = useState(props.value || "");
  const jsBtnColor = useTheme().palette.success;

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  function onJsBtnClicked() {
    setShowJsModal(true);
  }
  function onJsSave(code: string) {
    const newValue = "js:" + code;
    setValue(newValue);
    setShowJsModal(false);
    props.onChange && props.onChange(newValue);
  }
  function onChange(value: string) {
    props.onChange && props.onChange(value);
    setValue(value);
  }
  const isJsCode = typeof value === "string" && value.startsWith("js:");

  return (
    <FormControl fullWidth={props.fullWidth}>
      <InputLabel htmlFor={id}>{props.label}</InputLabel>
      <OutlinedInput
        sx={props.sx}
        value={value}
        error={props.error}
        onChange={(e) => onChange(e.target.value)}
        label={props.label}
        type={isJsCode ? "text" : props.type}
        id={id}
        size="small"
        endAdornment={
          <IconButton
            sx={{
              border: isJsCode ? `1px ${jsBtnColor.main} solid` : "",
            }}
            onClick={onJsBtnClicked}
            color="primary"
          >
            <IoLogoJavascript size={16} />
          </IconButton>
        }
      />
      <JsDialogEditor
        title="Edit JavaScript"
        open={showJsModal}
        defaultValue={isJsCode ? value.slice(3) : ""}
        onClose={() => setShowJsModal(false)}
        onSave={onJsSave}
      />
    </FormControl>
  );
};

export default InputWithJs;
