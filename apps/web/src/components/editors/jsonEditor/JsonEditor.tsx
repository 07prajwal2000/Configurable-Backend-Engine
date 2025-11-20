/**
 * JsonEditor Component
 * Main component for editing JSON objects and arrays
 */

import React, { useState, useEffect } from "react";
import {
  Stack,
  Card,
  Button,
  Group,
  SegmentedControl,
  Paper,
  Text,
  ScrollArea,
} from "@mantine/core";
import { TbDeviceFloppy, TbDownload } from "react-icons/tb";
import ObjectEditor from "./ObjectEditor";
import ArrayEditor from "./ArrayEditor";
import { JsonEditorProps, JsonValue } from "./types";
import { formatJson, createDefaultValue } from "./utils";

type TabValue = "editor" | "preview";

const JsonEditor: React.FC<JsonEditorProps> = ({
  rootValueType,
  defaultValue,
  onSave,
  readonly = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabValue>("editor");
  const [jsonValue, setJsonValue] = useState<JsonValue>(
    defaultValue ?? createDefaultValue(rootValueType)
  );

  useEffect(() => {
    if (defaultValue !== undefined) {
      setJsonValue(defaultValue);
    }
  }, [defaultValue]);

  const handleSave = () => {
    onSave(jsonValue);
  };

  const handleValueChange = (newValue: JsonValue) => {
    setJsonValue(newValue);
  };

  return (
    <Card withBorder radius="md" p={8} bg="white">
      <Card.Section withBorder inheritPadding py={6}>
        <Group justify="space-between" pt={4} align="center" gap={6}>
          <Text fw={600} size="sm">
            JSON Editor
          </Text>
          <SegmentedControl
            value={activeTab}
            onChange={(value) => setActiveTab(value as TabValue)}
            data={[
              { label: "Editor", value: "editor" },
              { label: "Preview", value: "preview" },
            ]}
            color="violet"
            size="xs"
          />
        </Group>
      </Card.Section>

      <Card.Section inheritPadding py={6}>
        {activeTab === "editor" ? (
          <Stack gap={6}>
            <ScrollArea>
              {rootValueType === "object" ? (
                <ObjectEditor
                  value={jsonValue as any}
                  onChange={handleValueChange}
                  readonly={readonly}
                  depth={0}
                />
              ) : (
                <ArrayEditor
                  value={jsonValue as any}
                  onChange={handleValueChange}
                  readonly={readonly}
                  depth={0}
                />
              )}
            </ScrollArea>
          </Stack>
        ) : (
          <Paper p={6} bg="gray.0" withBorder radius="md">
            <ScrollArea>
              <pre
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  lineHeight: "1.4",
                  color: "#333",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {formatJson(jsonValue)}
              </pre>
            </ScrollArea>
          </Paper>
        )}
      </Card.Section>

      {!readonly && (
        <Card.Section withBorder inheritPadding pb={"xs"}>
          <Group justify="flex-end">
            <Button
              onClick={handleSave}
              color="violet"
              leftSection={<TbDeviceFloppy size={16} />}
              size="xs"
            >
              Save
            </Button>
          </Group>
        </Card.Section>
      )}
    </Card>
  );
};

export default JsonEditor;
