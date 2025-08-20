import { Box, Typography } from "@mui/material";
import { useBlockStore } from "../../store/blockStore";
import { useNodes } from "@xyflow/react";
import { BlockTypes } from "../../constants/blockType";
import { ResponseBlockSidebar } from "../blocks/responseBlock";
import { IfBlockSidebar } from "../blocks/builtin/ifBlock";
import { EntrypointBlockSidebar } from "../blocks/entrypoint";
import { ForeachLoopBlockSidebar } from "../blocks/builtin/foreachLoopBlock";
import { ForLoopBlockSidebar } from "../blocks/builtin/forLoopBlock";
import { GetVarBlockSidebar } from "../blocks/builtin/getVarBlock";
import { SetVarBlockSidebar } from "../blocks/builtin/setVarBlock";
import { TransformerBlockSidebar } from "../blocks/builtin/transformerBlock";
import { JsExecutorSidebar } from "../blocks/builtin/jsExecutorBlock";
import { ConsoleLogBlockSidebar } from "../blocks/builtin/logging/consoleBlock";

const EditorSidebar = () => {
  const { selectedBlock } = useBlockStore();
  const blocks = useNodes();
  const block = blocks.find((node) => node.id === selectedBlock);

  if (!block) {
    return <Typography fontSize={15}>Main Settings</Typography>;
  }

  return (
    <Box>
      {block.type === BlockTypes.response && (
        <ResponseBlockSidebar block={block} />
      )}
      {block.type === BlockTypes.if && <IfBlockSidebar block={block} />}
      {block.type === BlockTypes.entrypoint && (
        <EntrypointBlockSidebar block={block} />
      )}
      {block.type === BlockTypes.foreachloop && (
        <ForeachLoopBlockSidebar block={block} />
      )}
      {block.type === BlockTypes.forloop && (
        <ForLoopBlockSidebar block={block} />
      )}
      {block.type === BlockTypes.getvar && <GetVarBlockSidebar block={block} />}
      {block.type === BlockTypes.setvar && <SetVarBlockSidebar block={block} />}
      {block.type === BlockTypes.consolelog && (
        <ConsoleLogBlockSidebar block={block} />
      )}
      {block.type === BlockTypes.jsrunner && (
        <JsExecutorSidebar block={block} />
      )}
      {block.type === BlockTypes.transformer && (
        <TransformerBlockSidebar block={block} />
      )}
    </Box>
  );
};

export default EditorSidebar;
