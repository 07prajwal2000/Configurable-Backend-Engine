import { useTheme } from "@mui/material";
import { Handle, useNodeConnections, type HandleProps } from "@xyflow/react";

const CustomHandle = (props: HandleProps) => {
  const connections = useNodeConnections({
    handleType: props.type,
  });
  const theme = useTheme();
  const sourceColor = theme.palette.primary.main;
  const targetColor = theme.palette.success.main;
  return (
    <Handle
      style={{
        backgroundColor: props.type == "source" ? sourceColor : targetColor,
      }}
      isConnectable={connections.length < 1}
      {...props}
    />
  );
};

export default CustomHandle;
