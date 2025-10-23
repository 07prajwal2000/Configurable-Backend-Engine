import {
  useEditorAiWindowStore,
  useEditorSearchbarStore,
} from "@/store/editor";
import { Box, Button, Flex, Paper, Stack, Text } from "@mantine/core";
import React, { useEffect } from "react";
import SearchInput from "./searchInput";
import BlockSearchList from "./blockSearchList";

const BlockSearchDrawer = () => {
  const { opened, close } = useEditorSearchbarStore();
  const aiWindowStore = useEditorAiWindowStore();
  const divRef = React.useRef<HTMLDivElement>(null);
  const addNewBtnRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    addNewBtnRef.current = document.getElementById("add-new-block");
  }, []);

  useEffect(() => {
    if (opened) {
      if (aiWindowStore.opened) aiWindowStore.toggle();
      document.addEventListener("click", handleClickEvent);
    } else {
      document.removeEventListener("click", handleClickEvent);
    }
  }, [opened]);

  function handleClickEvent(ev: MouseEvent) {
    if (
      divRef.current &&
      !divRef.current.contains(ev.target as Node) &&
      !addNewBtnRef.current?.contains(ev.target as Node)
    ) {
      close();
    }
  }

  return (
    <>
      <Paper
        ref={divRef}
        shadow="md"
        withBorder
        style={{
          zIndex: 1000,
          position: "absolute",
          right: opened ? 0 : "-25%",
          top: 0,
          transition: "right 0.3s",
        }}
        h={"100%"}
        w={"25%"}
        bg={"white"}
      >
        <Stack h={"100%"} gap={"sm"}>
          <Box>
            <Text
              size="md"
              fw={"400"}
              c={"white"}
              py={"sm"}
              bg={"gray.7"}
              px={"md"}
            >
              Search Block to add
            </Text>
            <Box p={"sm"} pb={0}>
              <SearchInput />
            </Box>
          </Box>
          <Box flex={1} mb={"md"} style={{ overflowY: "auto" }}>
            <BlockSearchList />
          </Box>
        </Stack>
      </Paper>
    </>
  );
};

export default BlockSearchDrawer;
