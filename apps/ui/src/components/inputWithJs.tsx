import { TextField, type BaseTextFieldProps } from "@mui/material";

interface Props extends BaseTextFieldProps {}

const InputWithJs = (props: Props) => {
  return (
    <>
      <TextField {...props} />
    </>
  );
};

export default InputWithJs;
