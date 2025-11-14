import React from "react";
import { Button } from "@mantine/core";
import { TbPlus } from "react-icons/tb";

const AppConfigTableAddButton = () => {
  const handleAddNew = () => {
    console.log("Add new config");
  };
  return (
    <Button
      size="xs"
      leftSection={<TbPlus size={16} />}
      color="violet"
      onClick={handleAddNew}
    >
      Add New
    </Button>
  );
};

export default AppConfigTableAddButton;
