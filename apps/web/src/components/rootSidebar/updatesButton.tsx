import { Button, Text, useMantineTheme } from "@mantine/core";
import { usePathname } from "next/navigation";
import path from "path";
import React from "react";
import { TbBell } from "react-icons/tb";

const NewInfo = () => {
  return (
    <Text
      bg={"red"}
      c={"white"}
      px={4}
      py={1}
      bdrs={"xs"}
      style={{ fontSize: ".7rem" }}
    >
      new
    </Text>
  );
};

const UpdatesButton = () => {
  const path = usePathname();
  // TODO: load notifications, and show if any

  return (
    <Button
      fullWidth
      leftSection={<TbBell size={20} />}
      rightSection={<NewInfo />}
      variant={"/updates" === path ? "light" : "subtle"}
      fw={"/updates" === path ? "bold" : ""}
      color={"violet"}
      justify="left"
    >
      Updates
    </Button>
  );
};

export default UpdatesButton;
