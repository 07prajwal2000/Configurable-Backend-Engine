import { Stack } from "@mantine/core";
import React from "react";
import AddNewBlockButton from "./toolbox/addNewBlockButton";
import AddStickyNoteButton from "./toolbox/addStickyNoteBlockButton";
import AiButton from "./toolbox/aiButton";

const EditorToolbox = () => {
  return (
    <Stack align="center">
      <AddNewBlockButton />
      <AddStickyNoteButton />
      <AiButton />
    </Stack>
  );
};

export default EditorToolbox;
