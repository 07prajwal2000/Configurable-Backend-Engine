import {
  Alert,
  AlertTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

type ErrorToastType = {
  type: "info" | "warning" | "error";
  message: string;
  title?: string;
  onClose?: () => void;
};

const Toast = (props: ErrorToastType) => {
  return (
    <Alert
      sx={{
        m: 0,
      }}
      severity={props.type}
      action={
        props.onClose && (
          <IconButton size="small" aria-label="close" onClick={props.onClose}>
            <MdClose />
          </IconButton>
        )
      }
    >
      {props.title && <AlertTitle>{props.title}</AlertTitle>}
      {props.message}
    </Alert>
  );
};

function showToast(
  options: Omit<ErrorToastType, "onClose">,
  closeBtn?: boolean
) {
  toast((t) => (
    <Toast
      {...options}
      onClose={closeBtn ? () => toast.dismiss(t.id) : undefined}
    />
  ));
}

export { Toast, showToast };
