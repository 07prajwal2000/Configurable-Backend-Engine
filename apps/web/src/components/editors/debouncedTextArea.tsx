import { Textarea, TextareaProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import React from "react";

interface PropTypes extends TextareaProps {
  value: string;
  onValueChange?: (value: string) => void;
  debounceDelay?: number;
}

const DebouncedTextArea = ({
  value,
  onValueChange,
  debounceDelay = 300,
  ...props
}: PropTypes) => {
  const [internalValue, setInternalValue] = React.useState(value);
  const debouncedCallback = useDebouncedCallback((value: string) => {
    onValueChange?.(value);
  }, debounceDelay);
  return (
    <Textarea
      onChange={(e) => {
        setInternalValue(e.target.value);
        debouncedCallback(e.target.value);
      }}
      value={internalValue}
      {...props}
    />
  );
};

export default DebouncedTextArea;
