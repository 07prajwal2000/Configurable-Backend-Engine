import {
  useEditorAiWindowStore,
  useEditorSearchbarStore,
} from "@/store/editor";
import { Button, Paper } from "@mantine/core";
import React, { useEffect } from "react";

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
          zIndex: 100,
          position: "absolute",
          right: opened ? 0 : "-25%",
          transition: "all 0.3s",
        }}
        h={"100%"}
        w={"25%"}
        bg={"white"}
        p={"lg"}
      >
        <Button>Search</Button>
      </Paper>
    </>
  );
};

export default BlockSearchDrawer;
