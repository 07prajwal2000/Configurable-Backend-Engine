/**
 * ValueRenderer Component
 * Renders the appropriate input control based on the value type
 */

import React, { useState, useEffect } from "react";
import { Group, Stack, Box } from "@mantine/core";
import JsTextInput from "../jsTextInput";
import { Checkbox } from "@mantine/core";
import TypeSelector from "./TypeSelector";
import ObjectEditor from "./ObjectEditor";
import ArrayEditor from "./ArrayEditor";
import { ValueRendererProps, JsonValue } from "./types";
import {
  getDataType,
  createDefaultValue,
  parseValue,
  valueToString,
} from "./utils";
import { useDisclosure } from "@mantine/hooks";

const ValueRenderer: React.FC<ValueRendererProps> = ({
  value,
  onChange,
  readonly = false,
  depth = 0,
}) => {
  const currentType = getDataType(value);
  const [displayValue, setDisplayValue] = useState(valueToString(value));
  const [isExpanded, { toggle: toggleExpanded }] = useDisclosure(true);

  useEffect(() => {
    setDisplayValue(valueToString(value));
  }, [value]);

  const handleTypeChange = (newType: typeof currentType) => {
    if (newType === currentType) return;
    onChange(createDefaultValue(newType));
  };

  const handleValueChange = (newValue: string) => {
    setDisplayValue(newValue);
    const parsed = parseValue(newValue, currentType);
    onChange(parsed);
  };

  const handleObjectChange = (newObj: any) => {
    onChange(newObj);
  };

  const handleArrayChange = (newArr: any[]) => {
    onChange(newArr);
  };

  // Render based on type
  if (currentType === "object") {
    return (
      <ObjectEditor
        value={value as any}
        onChange={handleObjectChange}
        readonly={readonly}
        depth={depth}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpanded}
      />
    );
  }

  if (currentType === "array") {
    return (
      <ArrayEditor
        value={value as any}
        onChange={handleArrayChange}
        readonly={readonly}
        depth={depth}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpanded}
      />
    );
  }

  if (currentType === "boolean") {
    return (
      <Group gap={4} align="center">
        <Checkbox
          checked={value as boolean}
          onChange={(e) => onChange(e.currentTarget.checked)}
          disabled={readonly}
          size="xs"
        />
        <TypeSelector
          currentType={currentType}
          onTypeChange={handleTypeChange}
          readonly={readonly}
        />
      </Group>
    );
  }

  // String and Number use JsTextInput
  return (
    <Group gap={4} align="flex-start" grow>
      <JsTextInput
        value={displayValue}
        onValueChange={handleValueChange}
        placeholder={currentType === "number" ? "0" : "Enter value"}
        disabled={readonly}
        size="xs"
      />
      <TypeSelector
        currentType={currentType}
        onTypeChange={handleTypeChange}
        readonly={readonly}
      />
    </Group>
  );
};

export default ValueRenderer;
