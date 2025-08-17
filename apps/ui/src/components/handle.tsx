import { useTheme } from "@mui/material";
import { Handle, useNodeConnections, type HandleProps } from "@xyflow/react";

interface CustomHandleProps extends HandleProps {
  bgColor?: string;
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
  maxConnections?: number;
}

const CustomHandle = (props: CustomHandleProps) => {
  const connections = useNodeConnections({
    handleType: props.type,
  });
  const theme = useTheme();
  const sourceColor = theme.palette.primary.main;
  const targetColor = theme.palette.success.main;
  const bgColor = props.type == "source" ? sourceColor : targetColor;
  return (
    <Handle
      style={{
        backgroundColor: props.bgColor || bgColor,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        top: props.top,
      }}
      {...props}
    />
  );
};

export default CustomHandle;
