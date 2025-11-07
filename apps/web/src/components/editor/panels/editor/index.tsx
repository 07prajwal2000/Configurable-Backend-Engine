import { Box } from "@mantine/core";
import React from "react";
import EditorToolbox from "./editorToolbox";
import BlockCanvas from "./blockCanvas";
import { ReactFlowProvider } from "@xyflow/react";

const EditorPanel = () => {
  return (
    <Box style={{ overflow: "hidden", position: "relative" }} h={"100%"}>
      <ReactFlowProvider>
        <BlockCanvas />
      </ReactFlowProvider>
    </Box>
  );
};

export default EditorPanel;
