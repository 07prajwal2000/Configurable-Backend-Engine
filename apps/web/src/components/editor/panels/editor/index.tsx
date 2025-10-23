import { Box } from "@mantine/core";
import React from "react";
import EditorToolbox from "./editorToolbox";
import BlockSearchDrawer from "./blockSearchDrawer";
import BlockCanvas from "./blockCanvas";

const EditorPanel = () => {
  return (
    <Box style={{ overflow: "hidden", position: "relative" }} h={"100%"}>
      <Box style={{ position: "absolute", zIndex: 10, right: 0 }} p={"lg"}>
        <EditorToolbox />
      </Box>
      <BlockCanvas />
      <BlockSearchDrawer />
    </Box>
  );
};

export default EditorPanel;
