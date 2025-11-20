/**
 * ArrayItem Component
 * Renders a single item in an array with controls
 */

import React from "react";
import {
  Grid,
  ActionIcon,
  Group,
  Stack,
  Paper,
  Badge,
  Text,
} from "@mantine/core";
import { TbTrashFilled, TbArrowUp, TbArrowDown } from "react-icons/tb";
import ValueRenderer from "./ValueRenderer";
import { ArrayItemProps } from "./types";

const ArrayItem: React.FC<ArrayItemProps> = ({
  value,
  index,
  onValueChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  readonly = false,
  depth = 0,
}) => {
  return (
    <Paper p={6} withBorder bg="white">
      <Grid align="flex-start" gutter={4}>
        {/* Index badge */}
        <Grid.Col span={{ base: 12, sm: "auto" }}>
          <Stack>
            <Badge size="xs" variant="light">
              [{index}]
            </Badge>
            {/* Controls */}
            <Group gap={2}>
              {!readonly && (
                <>
                  <ActionIcon
                    onClick={onMoveUp}
                    disabled={!canMoveUp}
                    variant="subtle"
                    color="violet"
                    size="xs"
                    title="Move up"
                  >
                    <TbArrowUp size={12} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={onMoveDown}
                    disabled={!canMoveDown}
                    variant="subtle"
                    color="violet"
                    size="xs"
                    title="Move down"
                  >
                    <TbArrowDown size={12} />
                  </ActionIcon>
                </>
              )}
              {!readonly && (
                <ActionIcon
                  onClick={onDelete}
                  color="red"
                  variant="subtle"
                  size="xs"
                  title="Delete item"
                >
                  <TbTrashFilled size={12} />
                </ActionIcon>
              )}
            </Group>
          </Stack>
        </Grid.Col>

        {/* Value */}
        <Grid.Col span={{ base: 12, sm: 11 }}>
          <ValueRenderer
            value={value}
            onChange={onValueChange}
            readonly={readonly}
            depth={depth + 1}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default ArrayItem;
