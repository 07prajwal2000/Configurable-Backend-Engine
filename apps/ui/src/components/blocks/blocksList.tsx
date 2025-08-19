import { Button, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { blocksList } from "../editor/blockEditor";

type BlocksListType = {
  onSelect?: (blockName: string) => void;
  filter?: {
    where: "category" | "name" | "none";
    value: string;
  };
};

const BlocksList = (props: BlocksListType) => {
  const filteredBlocks = useMemo(() => {
    const blocks = Object.values(blocksList);
    if (props.filter?.where == "category") {
      return blocks.filter((block) => block.category == props.filter?.value);
    } else if (props.filter?.where == "name") {
      return blocks.filter((block) =>
        block.name
          .toLowerCase()
          .includes(props.filter?.value.toLowerCase() || "")
      );
    } else {
      return blocks;
    }
  }, [props.filter]);

  return (
    <Stack
      direction={"column"}
      gap={1}
      maxHeight={"250px"}
      sx={{ overflowY: "auto" }}
    >
      {filteredBlocks.map((block) => (
        <Button
          onClick={() => props.onSelect && props.onSelect(block.name)}
          variant="text"
          key={block.name}
        >
          {block.title}
        </Button>
      ))}
      {filteredBlocks.length == 0 && (
        <Typography fontSize={13}>
          No Blocks found for{" "}
          {props.filter?.where == "category" ? "Category" : "Name"} with{" "}
          {props.filter?.value}
        </Typography>
      )}
    </Stack>
  );
};

export default BlocksList;
