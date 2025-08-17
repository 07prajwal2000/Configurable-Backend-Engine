import {
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  useTheme,
  type BaseTextFieldProps,
} from "@mui/material";
import { useId, useMemo, useState } from "react";
import { IoLogoJavascript } from "react-icons/io5";
import JsDialogEditor from "./editor/jsDialogEditor";

interface Props extends BaseTextFieldProps {
  onChange?: (value: string) => void;
  value?: string;
}

const InputWithJs = (props: Props) => {
  const id = useId();
  const [showJsModal, setShowJsModal] = useState(false);
  const [value, setValue] = useState(props.value || "");
  const jsBtnColor = useTheme().palette.success;

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
  const isJsCode = useMemo(() => value.startsWith("js:"), [value]);
  return (
    <FormControl fullWidth={props.fullWidth}>
      <InputLabel htmlFor={id}>{props.label}</InputLabel>
      <OutlinedInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={props.label}
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
