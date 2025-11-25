/**
 * ArrayEditor Component
 * Renders an array with items and controls
 */

import React, { useState } from "react";
import {
  Stack,
  Paper,
  Group,
  Button,
  Text,
  Select,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { TbPlus, TbChevronDown, TbChevronRight } from "react-icons/tb";
import ArrayItem from "./ArrayItem";
import { ArrayEditorProps, JsonArray, DataType } from "./types";
import { createDefaultValue } from "./utils";

const ArrayEditor: React.FC<ArrayEditorProps> = ({
  value,
  onChange,
  readonly = false,
  depth = 0,
  isExpanded = true,
  onToggleExpand,
  label,
}) => {
  const [newItemType, setNewItemType] = useState<DataType>("string");

  const handleValueChange = (index: number, newValue: any) => {
    const newArr = [...value];
    newArr[index] = newValue;
    onChange(newArr);
  };

  const handleDeleteItem = (index: number) => {
    const newArr = value.filter((_, i) => i !== index);
    onChange(newArr);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...value];
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    onChange(newArr);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newArr = [...value];
    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    onChange(newArr);
  };

  const handleAddItem = () => {
    const newArr = [...value];
    newArr.push(createDefaultValue(newItemType));
    onChange(newArr);
  };

  // Compact header for nested arrays
  if (depth > 0 && onToggleExpand) {
    return (
      <Stack gap={0}>
        {/* Collapsible header */}
        <Paper
          p={6}
          bg="gray.1"
          withBorder
          style={{ cursor: "pointer" }}
          onClick={onToggleExpand}
        >
          <Group gap={6} justify="space-between">
            <Group gap={6}>
              <ActionIcon
                size="xs"
                variant="transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
              >
                {isExpanded ? (
                  <TbChevronDown size={14} />
                ) : (
                  <TbChevronRight size={14} />
                )}
              </ActionIcon>
              <Text size="xs" fw={600}>
                {label || "[]"}
              </Text>
              <Badge size="xs" variant="light">
                {value.length} items
              </Badge>
            </Group>
          </Group>
        </Paper>

        {/* Expanded content */}
        {isExpanded && (
          <Paper p={6} bg="white" withBorder style={{ marginTop: -1 }}>
            <Stack gap={6}>
              {/* Array items */}
              {value.map((item, index) => (
                <ArrayItem
                  key={index}
                  value={item}
                  index={index}
                  onValueChange={(newValue) =>
                    handleValueChange(index, newValue)
                  }
                  onDelete={() => handleDeleteItem(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                  canMoveUp={index > 0}
                  canMoveDown={index < value.length - 1}
                  readonly={readonly}
                  depth={depth}
                />
              ))}

              {/* Add new item */}
              {!readonly && (
                <Paper mt={"sm"} p={6} bg="gray.0" withBorder>
                  <Stack gap={4}>
                    <Group gap={4} grow>
                      <Select
                        placeholder="Type"
                        data={[
                          { value: "string", label: "String" },
                          { value: "number", label: "Number" },
                          { value: "boolean", label: "Boolean" },
                          { value: "object", label: "Object" },
                          { value: "array", label: "Array" },
                          { value: "null", label: "Null" },
                        ]}
                        value={newItemType}
                        onChange={(val) =>
                          val && setNewItemType(val as DataType)
                        }
                        size="xs"
                      />
                      <Button
                        onClick={handleAddItem}
                        color="violet"
                        size="xs"
                        leftSection={<TbPlus size={12} />}
                      >
                        Add
                      </Button>
                    </Group>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
    );
  }

  // Root level array (not collapsible)
  return (
    <Paper
      withBorder
      p={8}
      radius="md"
      bg="gray.0"
      style={{ borderLeft: "3px solid var(--mantine-color-violet-6)" }}
    >
      <Stack gap={6}>
        {/* Opening bracket */}
        <Text fw={700} c="gray.7" size="xs">
          [
        </Text>

        {/* Array items */}
        <Stack gap={6} pl={8}>
          {value.map((item, index) => (
            <ArrayItem
              key={index}
              value={item}
              index={index}
              onValueChange={(newValue) => handleValueChange(index, newValue)}
              onDelete={() => handleDeleteItem(index)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              canMoveUp={index > 0}
              canMoveDown={index < value.length - 1}
              readonly={readonly}
              depth={depth}
            />
          ))}
        </Stack>

        {/* Add new item */}
        {!readonly && (
          <Paper p={6} bg="white" withBorder>
            <Stack gap={4}>
              <Group gap={4} grow>
                <Select
                  placeholder="Type"
                  data={[
                    { value: "string", label: "String" },
                    { value: "number", label: "Number" },
                    { value: "boolean", label: "Boolean" },
                    { value: "object", label: "Object" },
                    { value: "array", label: "Array" },
                  ]}
                  value={newItemType}
                  onChange={(val) => val && setNewItemType(val as DataType)}
                  size="xs"
                />
                <Button
                  onClick={handleAddItem}
                  color="violet"
                  size="xs"
                  leftSection={<TbPlus size={12} />}
                >
                  Add
                </Button>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Closing bracket */}
        <Text fw={700} c="gray.7" size="xs">
          ]
        </Text>
      </Stack>
    </Paper>
  );
};

export default ArrayEditor;
