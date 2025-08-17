import { Button, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

type BlocksListType = {
  onSelect?: (blockName: string) => void;
  filter?: {
    where: "category" | "name" | "none";
    value: string;
  };
};

const blocksList = [
  {
    name: "forloop",
    title: "For Loop",
    category: "logic",
  },
  {
    name: "foreachloop",
    title: "For Each Loop",
    category: "logic",
  },
  {
    name: "ifcondition",
    title: "If Condition",
    category: "logic",
  },
  {
    name: "setvar",
    title: "Set Var",
    category: "logic",
  },
  {
    name: "consolelog",
    title: "Console Log",
    category: "logging",
  },
  {
    name: "transformer",
    title: "Transformer",
    category: "misc",
  },
  {
    name: "jsrunner",
    title: "JS Runner",
    category: "misc",
  },
];

const BlocksList = (props: BlocksListType) => {
  const filteredBlocks = useMemo(() => {
    if (props.filter?.where == "category") {
      return blocksList.filter(
        (block) => block.category == props.filter?.value
      );
    } else if (props.filter?.where == "name") {
      return blocksList.filter((block) =>
        block.name
          .toLowerCase()
          .includes(props.filter?.value.toLowerCase() || "")
      );
    } else {
      return blocksList;
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
