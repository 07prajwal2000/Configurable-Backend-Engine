import { useEditorAiWindowStore } from "@/store/editor";
import {
  ActionIcon,
  Button,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { TbCpu } from "react-icons/tb";

const AiButton = () => {
  const { opened, toggle } = useEditorAiWindowStore();
  const violet = useMantineTheme().colors.violet;

  return (
    <Tooltip
      position="left"
      withArrow
      arrowSize={8}
      label={<Text size={"xs"}>AI</Text>}
    >
      <ActionIcon
        onClick={toggle}
        px={"sm"}
        size={48}
        color="violet"
        variant="outline"
        bg={opened ? violet[1] : ""}
      >
        <Stack gap={0} justify="center" align="center">
          <TbCpu size={25} />
          <Text fw={opened ? "bold" : ""} size={"12px"}>
            AI
          </Text>
        </Stack>
      </ActionIcon>
    </Tooltip>
  );
};

export default AiButton;
