import { ActionIcon, Tooltip } from "@mantine/core";
import React from "react";
import { TbHistory } from "react-icons/tb";

const VersionHistoryButton = () => {
  return (
    <Tooltip withArrow color="dark" label="Version History">
      <ActionIcon variant="subtle" color="dark">
        <TbHistory size={20} />
      </ActionIcon>
    </Tooltip>
  );
};

export default VersionHistoryButton;
