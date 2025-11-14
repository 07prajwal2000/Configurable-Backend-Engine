import React from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { TbEdit } from "react-icons/tb";

interface AppConfigTableEditButtonProps {
  id: string | number;
}

const AppConfigTableEditButton: React.FC<AppConfigTableEditButtonProps> = ({
  id,
}) => {
  const handleEdit = () => {
    // Empty callback - implementation left for later
    console.log("Edit config:", id);
  };

  return (
    <Tooltip label="Edit">
      <ActionIcon variant="light" color="violet" size="sm" onClick={handleEdit}>
        <TbEdit size={16} />
      </ActionIcon>
    </Tooltip>
  );
};

export default AppConfigTableEditButton;
