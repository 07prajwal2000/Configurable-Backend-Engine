import { Group } from "@mantine/core";
import React from "react";
import UndoPanel from "./undoPanel";
import ZoomToolbox from "./zoomToolbox";
import FormatBlocksButton from "./formatBlocksButton";

const CanvasToolboxPanel = () => {
  return (
    <Group>
      <ZoomToolbox />
      <FormatBlocksButton />
      <UndoPanel />
    </Group>
  );
};

export default CanvasToolboxPanel;
