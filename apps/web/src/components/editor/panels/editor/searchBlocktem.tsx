import { Box, Center, Flex, Grid, Group, Paper, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import React from "react";
import {
  TbArrowNarrowRight,
  TbArrowRight,
  TbCodeVariable,
  TbMap,
} from "react-icons/tb";

type Props = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  active?: boolean;
  showRightArrow?: boolean;
  onClick?: (id: string) => void;
};

const SearchBlockItem = (props: Props) => {
  const { ref, hovered } = useHover();

  function onClick() {
    props.onClick && props.onClick(props.id);
  }

  return (
    <Paper
      onClick={onClick}
      ref={ref}
      p={"xs"}
      pos={"relative"}
      style={{
        cursor: "pointer",
      }}
      bg={hovered ? "gray.0" : "white"}
    >
      <Box
        pos={"absolute"}
        top={0}
        bottom={0}
        display={props.active || hovered ? "block" : "none"}
        left={0}
        p={1}
        bg={props.active ? "red" : hovered ? "gray.5" : "transparent"}
      />
      <Grid>
        <Grid.Col span={2}>
          <Center my={"auto"} h={"100%"} p={4} c={"dark"}>
            {props.icon || <TbCodeVariable size={20} />}
          </Center>
        </Grid.Col>
        <Grid.Col span={9}>
          <Flex direction={"column"}>
            <Text>{props.title}</Text>
            <Text c={"gray"} size={"xs"}>
              {props.description}
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={1} h={"100%"} c="dark">
          <Center my={"auto"} h={"100%"} w={"100%"}>
            {!props.showRightArrow && <TbArrowNarrowRight size={30} />}
          </Center>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default SearchBlockItem;
