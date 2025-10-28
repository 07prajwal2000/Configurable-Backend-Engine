import { Menu, ActionIcon } from "@mantine/core";
import React from "react";
import { TbCopy, TbDots, TbExternalLink, TbTrashFilled } from "react-icons/tb";

type PropTypes = {
  blockId: string;
  showDelete?: boolean;
};

const BlockOptionsMenu = (props: PropTypes) => {
  return (
    <Menu shadow="lg" width={200} withArrow position="bottom-end">
      <Menu.Target>
        <ActionIcon color="dark" variant="transparent" size="xs" fw={500}>
          <TbDots size={15} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<TbExternalLink size={15} />}>Open</Menu.Item>
        <Menu.Item leftSection={<TbCopy size={15} />}>Duplicate</Menu.Item>
        {props.showDelete && (
          <Menu.Item leftSection={<TbTrashFilled size={15} />}>
            Delete
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default BlockOptionsMenu;
