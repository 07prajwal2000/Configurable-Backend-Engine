import { Box } from "@mantine/core";
import React from "react";
import EditorToolbox from "./editorToolbox";
import BlockSearchDrawer from "./blockSearchDrawer";

const EditorPanel = () => {
  return (
    <Box style={{ overflow: "hidden", position: "relative" }} h={"100%"}>
      <Box style={{ position: "absolute", right: 0 }} p={"lg"}>
        <EditorToolbox />
      </Box>
      <BlockSearchDrawer />
    </Box>
  );
};

export default EditorPanel;
