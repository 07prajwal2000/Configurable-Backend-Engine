/**
 * ObjectEditor Component
 * Renders an object with key-value pairs
 */

import React, { useState } from "react";
import {
  Stack,
  Paper,
  Group,
  Button,
  Text,
  TextInput,
  Select,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { TbPlus, TbChevronDown, TbChevronRight } from "react-icons/tb";
import KeyValueRow from "./KeyValueRow";
import { ObjectEditorProps, JsonObject, DataType } from "./types";
import { createDefaultValue } from "./utils";

const ObjectEditor: React.FC<ObjectEditorProps> = ({
  value,
  onChange,
  readonly = false,
  depth = 0,
  isExpanded = true,
  onToggleExpand,
  label,
}) => {
  const [newKeyName, setNewKeyName] = useState("");
  const [newValueType, setNewValueType] = useState<DataType>("string");

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const newObj = { ...value };
    if (oldKey in newObj) {
      newObj[newKey] = newObj[oldKey];
      delete newObj[oldKey];
    }
    onChange(newObj);
  };

  const handleValueChange = (key: string, newValue: any) => {
    const newObj = { ...value };
    newObj[key] = newValue;
    onChange(newObj);
  };

  const handleDeleteKey = (key: string) => {
    const newObj = { ...value };
    delete newObj[key];
    onChange(newObj);
  };

  const handleAddField = () => {
    if (!newKeyName.trim()) return;
    const newObj = { ...value };
    newObj[newKeyName] = createDefaultValue(newValueType);
    onChange(newObj);
    setNewKeyName("");
    setNewValueType("string");
  };

  const entries = Object.entries(value);

  // Compact header for nested objects
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
                {label || "{}"}
              </Text>
              <Badge size="xs" variant="light">
                {entries.length} fields
              </Badge>
            </Group>
          </Group>
        </Paper>

        {/* Expanded content */}
        {isExpanded && (
          <Paper p={6} bg="white" withBorder style={{ marginTop: -1 }}>
            <Stack gap={6}>
              {/* Key-value pairs */}
              {entries.map(([key, val]) => (
                <KeyValueRow
                  key={key}
                  keyName={key}
                  value={val}
                  onKeyChange={(newKey) => handleKeyChange(key, newKey)}
                  onValueChange={(newValue) => handleValueChange(key, newValue)}
                  onDelete={() => handleDeleteKey(key)}
                  readonly={readonly}
                />
              ))}

              {/* Add new field */}
              {!readonly && (
                <Paper mt={"sm"} p={6} bg="gray.0" withBorder>
                  <Stack gap={4}>
                    <Group gap={4} grow>
                      <TextInput
                        placeholder="Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.currentTarget.value)}
                        size="xs"
                      />
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
                        value={newValueType}
                        onChange={(val) =>
                          val && setNewValueType(val as DataType)
                        }
                        size="xs"
                      />
                      <Button
                        onClick={handleAddField}
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

  // Root level object (not collapsible)
  return (
    <Paper
      withBorder
      p={8}
      radius="md"
      bg="gray.0"
      style={{ borderLeft: "3px solid var(--mantine-color-violet-6)" }}
    >
      <Stack gap={6}>
        {/* Opening brace */}
        <Text fw={700} c="gray.7" size="xs">
          {"{"}
        </Text>

        {/* Key-value pairs */}
        <Stack gap={6} pl={8}>
          {entries.map(([key, val]) => (
            <KeyValueRow
              key={key}
              keyName={key}
              value={val}
              onKeyChange={(newKey) => handleKeyChange(key, newKey)}
              onValueChange={(newValue) => handleValueChange(key, newValue)}
              onDelete={() => handleDeleteKey(key)}
              readonly={readonly}
            />
          ))}
        </Stack>

        {/* Add new field */}
        {!readonly && (
          <Paper p={6} bg="white" withBorder>
            <Stack gap={4}>
              <Group gap={4} grow>
                <TextInput
                  placeholder="Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.currentTarget.value)}
                  size="xs"
                />
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
                  value={newValueType}
                  onChange={(val) => val && setNewValueType(val as DataType)}
                  size="xs"
                />
                <Button
                  onClick={handleAddField}
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

        {/* Closing brace */}
        <Text fw={700} c="gray.7" size="xs">
          {"}"}
        </Text>
      </Stack>
    </Paper>
  );
};

export default ObjectEditor;
