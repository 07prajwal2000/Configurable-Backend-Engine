import { useTheme } from "@mui/material";
import { Handle, type HandleProps, type NodeConnection } from "@xyflow/react";

interface CustomHandleProps extends HandleProps {
  bgColor?: string;
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
}

const CustomHandle = (props: CustomHandleProps) => {
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

export function connectionExist(
  handleId: string,
  type: "source" | "target",
  connections: NodeConnection[]
) {
  for (let i = 0; i < connections.length; i++) {
    const cur = connections[i];
    if (type == "source" && cur.sourceHandle == handleId) {
      return true;
    } else if (type == "target" && cur.targetHandle == handleId) {
      return true;
    }
  }
  return false;
}

export default CustomHandle;
