import { ActionIcon, Button, Menu } from "@mantine/core";
import React from "react";
import { TbFilterCog } from "react-icons/tb";

const RouterFilter = () => {
  return (
    <Menu shadow="lg" width={200} withArrow position="bottom-end">
      <Menu.Target>
        <ActionIcon color={"violet"} variant="outline">
          <TbFilterCog size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown p={"xs"}>
        <p>Nothing is here now currently</p>
        <Button variant="outline" color="red" fullWidth size="xs">
          Reset Filter
        </Button>
      </Menu.Dropdown>
    </Menu>
  );
};

export default RouterFilter;
