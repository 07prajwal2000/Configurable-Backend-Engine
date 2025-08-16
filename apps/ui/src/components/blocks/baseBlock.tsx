import { Paper, Stack, Typography, useTheme } from "@mui/material";
import { type NodeProps } from "@xyflow/react";
import type React from "react";
import { useBlockStore } from "../../store/blockStore";

interface BlockProps extends NodeProps {
  children?: React.ReactNode | React.ReactNode[];
  onSelected?: (data?: any) => void;
  title: string;
  alignCenter?: boolean;
}

const BaseBlock = (props: BlockProps) => {
  const theme = useTheme();
  const { selectedBlock } = useBlockStore();
  const isSelected = selectedBlock == props.id;

  return (
    <Paper
      className="block__node"
      sx={{
        "&:hover": {
          "& .helper__btns": {
            display: "block",
          },
        },
        position: "relative",
        minHeight: "25px",
        minWidth: "100px",
        outlineColor: theme.palette.primary.main,
        outlineWidth: 1,
        outlineStyle: isSelected ? "solid" : "none",
      }}
    >
      <Stack
        sx={{ px: "4px", py: "4px" }}
        alignItems={props.alignCenter ? "center" : "left"}
        direction={"column"}
      >
        <Typography fontSize={7}>{props.title}</Typography>
        {props.children}
      </Stack>
    </Paper>
  );
};

export default BaseBlock;
