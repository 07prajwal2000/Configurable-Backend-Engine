import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import React, { useEffect } from "react";
import { NodeProps, NodeResizer } from "@xyflow/react";
import z from "zod";
import { stickyNotesSchema } from "@cbe/blocks";
import { useContext } from "react";
import { BlockCanvasContext } from "@/context/blockCanvas";
import { TbTrashFilled } from "react-icons/tb";
import { useDebouncedCallback } from "@mantine/hooks";
import { DataSettingsProps } from "../settingsDialog/blockSettingsDialog";
import { useBlockDataStore } from "@/store/blockDataStore";

const colors = ["red", "green", "blue", "yellow"];

const StickyNote = (props: NodeProps) => {
  const blockDataStore = useBlockDataStore();
  const data = blockDataStore[props.id] as z.infer<typeof stickyNotesSchema>;
  const { updateBlockData, deleteBlock } = useContext(BlockCanvasContext);
  const theme = useMantineTheme().colors;
  let borderColor = "",
    backgroundColor = "",
    textColor = "";
  if (!data) return <></>;

  switch (data.color) {
    case "red":
      borderColor = "red";
      backgroundColor = "red.2";
      textColor = "red.9";
      break;
    case "green":
      borderColor = "green";
      backgroundColor = "green.2";
      textColor = "green.9";
      break;
    case "blue":
      borderColor = "blue";
      backgroundColor = "blue.2";
      textColor = "blue.9";
      break;
    case "yellow":
      borderColor = "yellow";
      backgroundColor = "yellow.2";
      textColor = "yellow.9";
      break;
  }

  function onResize(width: number, height: number) {
    updateBlockData(props.id, {
      size: {
        width,
        height,
      },
      notes: data.notes,
      color: data.color,
    } as z.infer<typeof stickyNotesSchema>);
  }

  function changeColor(color: string) {
    updateBlockData(props.id, {
      size: {
        width: data.size.width,
        height: data.size.height,
      },
      notes: data.notes,
      color,
    } as z.infer<typeof stickyNotesSchema>);
  }

  return (
    <Box
      bg={backgroundColor}
      p="4"
      bdrs="sm"
      c={textColor}
      w={`${data.size.width}px`}
      h={`${data.size.height}px`}
      bd={`2px solid ${borderColor}`}
      pos="relative"
    >
      <NodeResizer
        minHeight={75}
        minWidth={75}
        maxHeight={200}
        maxWidth={200}
        nodeId={props.id}
        color={theme.violet[6]}
        onResize={(_, e) => onResize(e.width, e.height)}
        isVisible={props.selected}
      />
      <Paper
        pos="absolute"
        top={-20}
        display={props.selected ? "block" : "none"}
        right={0}
        shadow="xs"
        w={"fit-content"}
      >
        <Group gap={2} pr={4}>
          <ActionIcon
            size="xs"
            p={0}
            variant="transparent"
            color="dark"
            onClick={() => deleteBlock(props.id)}
          >
            <TbTrashFilled size={7} />
          </ActionIcon>
          {colors.map((color) => (
            <Box
              key={color}
              bg={color}
              style={{ cursor: "pointer" }}
              w={8}
              h={8}
              onClick={() => changeColor(color)}
            />
          ))}
        </Group>
      </Paper>
      {data.notes ? (
        <Text
          style={{
            fontSize: "8px",
            overflow: "hidden",
            maxHeight: "100%",
            maxWidth: "100%",
          }}
        >
          {data.notes}
        </Text>
      ) : (
        <Stack
          justify="center"
          align="center"
          gap={2}
          style={{ height: "100%" }}
        >
          <Text style={{ fontSize: "8px", fontWeight: "500" }}>
            Sticky Note
          </Text>
          <Text style={{ fontSize: "6px" }}>Double click to edit</Text>
        </Stack>
      )}
    </Box>
  );
};

export function StickyNoteHelpPanel({
  blockId,
  blockData,
}: DataSettingsProps<z.infer<typeof stickyNotesSchema>>) {
  const { updateBlockData } = useContext(BlockCanvasContext);
  function onColorChange(color: string) {
    updateBlockData(blockId, {
      color,
    } as z.infer<typeof stickyNotesSchema>);
  }
  return (
    <Stack>
      <Select
        leftSection={<Box bg={blockData.color} w={12} h={12} />}
        data={colors}
        value={blockData.color}
        placeholder="Select a color"
        label="Note Color"
        onChange={(value) => onColorChange(value as string)}
        renderOption={(item) => (
          <Group>
            <Box
              bg={item.option.value}
              style={{ cursor: "pointer" }}
              w={12}
              h={12}
            />
            <Text>{item.option.value}</Text>
          </Group>
        )}
      />
    </Stack>
  );
}

export function StickyNoteSettingsPanel({
  blockId,
  blockData,
}: DataSettingsProps<z.infer<typeof stickyNotesSchema>>) {
  const { updateBlockData } = useContext(BlockCanvasContext);
  const [note, setNote] = React.useState(blockData.notes);
  const debouncedUpdate = useDebouncedCallback(() => {
    onNoteChange(note);
  }, 100);

  useEffect(() => {
    debouncedUpdate();
  }, [note]);

  function onNoteChange(value: string) {
    updateBlockData(blockId, {
      notes: value,
    } as z.infer<typeof stickyNotesSchema>);
  }

  return (
    <Box h={"100%"}>
      <Textarea
        placeholder="Add your notes here..."
        label="Notes"
        h={"100%"}
        w={"100%"}
        autosize
        minRows={20}
        maxRows={23}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </Box>
  );
}

export default StickyNote;
