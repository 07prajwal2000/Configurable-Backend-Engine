/**
 * TypeSelector Component
 * Allows users to select the data type for a value
 */

import React from "react";
import { Select } from "@mantine/core";
import { TypeSelectorProps, DataType } from "./types";

const TYPE_OPTIONS: Array<{ value: DataType; label: string }> = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "array", label: "Array" },
];

const TypeSelector: React.FC<TypeSelectorProps> = ({
  currentType,
  onTypeChange,
  readonly = false,
}) => {
  return (
    <Select
      flex={1}
      data={TYPE_OPTIONS}
      value={currentType}
      onChange={(value) => value && onTypeChange(value as DataType)}
      disabled={readonly}
      searchable
      clearable={false}
      size="xs"
      w={100}
    />
  );
};

export default TypeSelector;
