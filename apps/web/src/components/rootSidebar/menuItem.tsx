"use client";

import { Button } from "@mantine/core";
import React from "react";

type MenuItemProps = {
  isActive: boolean;
  text: string;
  onClick?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const MenuItem = (props: MenuItemProps) => {
  return (
    <Button
      fullWidth
      leftSection={props.leftIcon}
      rightSection={props.rightIcon}
      variant={props.isActive ? "light" : "subtle"}
      fw={props.isActive ? "bold" : ""}
      color={"violet"}
      justify="left"
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
};

export default MenuItem;
