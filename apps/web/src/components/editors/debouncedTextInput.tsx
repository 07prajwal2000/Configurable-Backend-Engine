import React from "react";
import { TextInput, TextInputProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";

interface DebouncedTextInputProps extends TextInputProps {
  onValueChange?: (value: string) => void;
  debounceDelay?: number;
}

const DebouncedTextInput = ({
  value,
  onValueChange,
  debounceDelay = 300,
  ...props
}: DebouncedTextInputProps) => {
  const [internalValue, setInternalValue] = React.useState(value);
  const debouncedCallback = useDebouncedCallback((value: string) => {
    onValueChange?.(value);
  }, debounceDelay);
  return (
    <TextInput
      onChange={(e) => {
        setInternalValue(e.target.value);
        debouncedCallback(e.target.value);
      }}
      value={internalValue}
      {...props}
    />
  );
};

export default DebouncedTextInput;
