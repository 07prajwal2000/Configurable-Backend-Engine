import { Group } from "@mantine/core";
import React from "react";
import UndoPanel from "./undoPanel";
import ZoomToolbox from "./zoomToolbox";

const CanvasToolboxPanel = () => {
  return (
    <Group>
      <ZoomToolbox />
      <UndoPanel />
    </Group>
  );
};

export default CanvasToolboxPanel;
