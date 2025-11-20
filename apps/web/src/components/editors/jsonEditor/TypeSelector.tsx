/**
 * TypeSelector Component
 * Allows users to select the data type for a value
 */

import React from "react";
import { Select, SelectProps } from "@mantine/core";
import { TypeSelectorProps, DataType } from "./types";

const TYPE_OPTIONS: Array<{ value: DataType; label: string }> = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "array", label: "Array" },
  { value: "null", label: "Null" },
];

const TypeSelector: React.FC<TypeSelectorProps> = ({
  currentType,
  onTypeChange,
  readonly = false,
}) => {
  return (
    <Select
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
