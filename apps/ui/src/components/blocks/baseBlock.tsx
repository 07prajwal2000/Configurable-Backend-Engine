import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { type NodeProps } from "@xyflow/react";
import type React from "react";
import { useBlockStore } from "../../store/blockStore";
import { MdInfo, MdSettings } from "react-icons/md";
import { useEffect } from "react";

interface BlockProps extends NodeProps {
  children?: React.ReactNode | React.ReactNode[];
  onSelected?: (data?: any) => void;
  title: string;
  alignCenter?: boolean;
  showSettings?: boolean;
  showInfo?: boolean;
}

const BaseBlock = (props: BlockProps) => {
  const theme = useTheme();
  const {
    selectedBlock,
    setSelectedBlock,
    infoSelectedBlock,
    setInfoSelectedBlock,
  } = useBlockStore();
  const isSelected = selectedBlock == props.id;
  useEffect(() => {
    if (props.id == selectedBlock && !props.selected) {
      setSelectedBlock("");
    }
    if (props.id == infoSelectedBlock && !props.selected) {
      setInfoSelectedBlock("");
    }
  }, []);
  function SettingsBtn() {
    return (
      <Box
        onClick={() => setSelectedBlock(props.id)}
        className="helper__btns"
        sx={{
          display: "none",
          position: "absolute",
          width: "20px",
          height: "20px",
          top: -3,
          right: -8,
          cursor: "pointer",
          color: theme.palette.primary.dark,
        }}
        // variant="outlined"
        // size="small"
      >
        <MdSettings style={{ width: "8px", height: "8px" }} />
      </Box>
    );
  }
  function InfoBtn() {
    return (
      <Box
        onClick={() => setInfoSelectedBlock(props.id)}
        className="helper__btns"
        sx={{
          display: "none",
          position: "absolute",
          width: "20px",
          height: "20px",
          top: -3,
          right: -8,
          cursor: "pointer",
          color: theme.palette.primary.dark,
        }}
      >
        <MdInfo style={{ width: "8px", height: "8px" }} />
      </Box>
    );
  }
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
        {props.showSettings && <SettingsBtn />}
        {props.showInfo && <InfoBtn />}
      </Stack>
    </Paper>
  );
};

export default BaseBlock;
