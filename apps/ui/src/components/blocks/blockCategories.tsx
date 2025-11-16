import { Button, Stack } from "@mui/material";
import { BlockCategories as CategoriesEnum } from "@fluxify/blocks";

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
      {Object.values(CategoriesEnum).map((category) => (
        <Button
          onClick={() => props.onClick && props.onClick(category)}
          variant="text"
          key={category}
        >
          {category.toUpperCase()}
        </Button>
      ))}
    </Stack>
  );
};

export default BlockCategories;
