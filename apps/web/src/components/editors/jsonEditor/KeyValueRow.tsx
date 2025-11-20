/**
 * KeyValueRow Component
 * Renders a single key-value pair for object editing
 */

import React from "react";
import { Grid, TextInput, ActionIcon, Group, Text, Stack } from "@mantine/core";
import { TbTrashFilled } from "react-icons/tb";
import ValueRenderer from "./ValueRenderer";
import { KeyValueRowProps } from "./types";
import { getDataType } from "./utils";

const KeyValueRow: React.FC<KeyValueRowProps> = ({
  keyName,
  value,
  onKeyChange,
  onValueChange,
  onDelete,
  readonly = false,
}) => {
  const valueType = getDataType(value);
  const isComplexType = valueType === "object" || valueType === "array";

  if (isComplexType) {
    return (
      <Stack gap={4}>
        {/* Key row */}
        <Grid align="flex-start" gutter={4}>
          {/* Key Input */}
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <TextInput
              placeholder="Key"
              value={keyName}
              onChange={(e) => onKeyChange(e.currentTarget.value)}
              disabled={readonly}
              size="xs"
            />
          </Grid.Col>

          {/* Colon Separator */}
          <Grid.Col span={{ base: 12, sm: "auto" }} w={20}>
            <Group justify="center" h="100%">
              <Text fw={500} c="gray" size="xs">
                :
              </Text>
            </Group>
          </Grid.Col>

          {/* Delete Button */}
          {!readonly && (
            <Grid.Col span={{ base: 12, sm: "auto" }}>
              <ActionIcon
                color="red"
                onClick={onDelete}
                variant="subtle"
                size="xs"
              >
                <TbTrashFilled size={12} />
              </ActionIcon>
            </Grid.Col>
          )}
        </Grid>

        {/* Nested editor below */}
        <div style={{ marginLeft: 0 }}>
          <ValueRenderer
            value={value}
            onChange={onValueChange}
            readonly={readonly}
            depth={1}
          />
        </div>
      </Stack>
    );
  }

  // Simple value types - render inline
  return (
    <Grid align="flex-start" gutter={4}>
      {/* Key Input */}
      <Grid.Col span={{ base: 12, sm: 3 }}>
        <TextInput
          placeholder="Key"
          value={keyName}
          onChange={(e) => onKeyChange(e.currentTarget.value)}
          disabled={readonly}
          size="xs"
        />
      </Grid.Col>

      {/* Colon Separator */}
      <Grid.Col span={{ base: 12, sm: "auto" }} w={20}>
        <Group justify="center" h="100%">
          <Text fw={500} c="gray" size="xs">
            :
          </Text>
        </Group>
      </Grid.Col>

      {/* Value Input */}
      <Grid.Col span={{ base: 12, sm: 7 }}>
        <ValueRenderer
          value={value}
          onChange={onValueChange}
          readonly={readonly}
          depth={1}
        />
      </Grid.Col>

      {/* Delete Button */}
      {!readonly && (
        <Grid.Col span={{ base: 12, sm: "auto" }}>
          <ActionIcon
            color="red"
            onClick={onDelete}
            variant="subtle"
            size="xs"
          >
            <TbTrashFilled size={12} />
          </ActionIcon>
        </Grid.Col>
      )}
    </Grid>
  );
};

export default KeyValueRow;
