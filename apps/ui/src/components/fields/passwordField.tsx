import {
  Box,
  Button,
  IconButton,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import type React from "react";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const PasswordField: React.FC<TextFieldProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  function toggleDisplay() {
    setShowPassword((p) => !p);
  }

  return (
    <Box
      sx={{
        width: props.fullWidth ? "100%" : "auto",
        position: "relative",
      }}
    >
      <TextField {...props} type={showPassword ? "text" : "password"} />
      <IconButton
        sx={{ position: "absolute", right: 5, top: 3 }}
        onClick={toggleDisplay}
        size="small"
      >
        {showPassword ? <IoMdEyeOff size={25} /> : <IoMdEye size={25} />}
      </IconButton>
    </Box>
  );
};

export default PasswordField;
