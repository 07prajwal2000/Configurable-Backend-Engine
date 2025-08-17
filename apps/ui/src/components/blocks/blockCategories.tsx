import { Button, Stack } from "@mui/material";

const categories = [
  {
    name: "logic",
    title: "Logic",
  },
  {
    name: "debug",
    title: "Debug",
  },
  {
    name: "database",
    title: "Database",
  },
  {
    name: "logging",
    title: "Logging",
  },
  {
    name: "misc",
    title: "Misc",
  },
];

type BlockCategoriesType = {
  onClick?: (value: string) => void;
};

const BlockCategories = (props: BlockCategoriesType) => {
  return (
    <Stack
      direction={"column"}
      gap={1}
      maxHeight={"250px"}
      sx={{ overflowY: "auto" }}
    >
      {categories.map((category) => (
        <Button
          onClick={() => props.onClick && props.onClick(category.name)}
          variant="text"
          key={category.name}
        >
          {category.title}
        </Button>
      ))}
    </Stack>
  );
};

export default BlockCategories;
