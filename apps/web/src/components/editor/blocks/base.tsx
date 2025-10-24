import {
  Box,
  Center,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { NodeProps, Position } from "@xyflow/react";
import React from "react";
import BlockHandle from "./handle";

type PropTypes = {
  tooltip: string;
  blockName: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  nodeProps?: NodeProps;
  topLeftRounded?: boolean;
  topRightRounded?: boolean;
  bottomLeftRounded?: boolean;
  bottomRightRounded?: boolean;
  showTooltip?: boolean;
};

const BaseBlock = (props: PropTypes) => {
  const { nodeProps } = props;
  const gray = useMantineTheme().colors.gray;
  const borderRaduis = "4px";
  const roundedRadius = "20px";

  return (
    <Tooltip
      withArrow
      hidden={!props.showTooltip}
      arrowSize={8}
      color="dark"
      label={props.tooltip}
    >
      <Paper
        p={"sm"}
        c={"dark"}
        style={{
          outline: nodeProps?.selected ? `4px solid ${gray[2]}` : "none",
          backgroundColor: nodeProps?.selected ? gray[0] : "white",
          cursor: "pointer",
          borderTopLeftRadius: props.topLeftRounded
            ? roundedRadius
            : borderRaduis,
          borderTopRightRadius: props.topRightRounded
            ? roundedRadius
            : borderRaduis,
          borderBottomLeftRadius: props.bottomLeftRounded
            ? roundedRadius
            : borderRaduis,
          borderBottomRightRadius: props.bottomRightRounded
            ? roundedRadius
            : borderRaduis,
        }}
        withBorder
      >
        <Stack gap={8}>
          <Center>{props.icon}</Center>
          {props.children}
          <Text
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              textAlign: "center",
            }}
            size="6px"
          >
            {props.blockName}
          </Text>
        </Stack>
        {/* <Center>
      </Center> */}
      </Paper>
    </Tooltip>
  );
};

export default BaseBlock;
