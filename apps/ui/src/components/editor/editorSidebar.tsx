import { Box, Typography } from "@mui/material";
import React from "react";
import { useBlockStore } from "../../store/blockStore";

const EditorSidebar = () => {
  const { selectedBlock } = useBlockStore();
  return (
    <Box>
      <Typography fontSize={15}>Settings will come here for blocks</Typography>
      <Typography>Selected Block: {selectedBlock || "None"}</Typography>
    </Box>
  );
};

export default EditorSidebar;
