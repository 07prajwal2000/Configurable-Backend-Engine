import { ActionIcon, Button, Grid, Stack, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { TbTrashFilled } from "react-icons/tb";
import JsTextInput from "./jsTextInput";

type InputType = "text" | "js text";

type PropTypes = {
  data: Record<string, string>;
  onDataChange?: (data: Record<string, string>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  inputType?: InputType;
  allowDuplicateKeys?: boolean;
  addButtonText?: string;
};

const KVPEditor = ({
  data,
  onDataChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  inputType = "text",
  addButtonText = "Add New Key-Value Pair",
}: PropTypes) => {
  const [tempData, setTempData] = useState<[string, string][]>(
    Object.entries(data)
  );

  const handleKeyValueChange = (key: string, value: string, index: number) => {
    const newData = [...tempData];
    newData[index] = [key, value];
    setTempData(newData);
    onDataChange?.(Object.fromEntries(newData));
  };

  const handleAddNewPair = () => {
    const newData: [string, string][] = [...tempData, ["", ""]];
    setTempData(newData);
    onDataChange?.(Object.fromEntries(newData));
  };

  const handleDeletePair = (index: number) => {
    const newData = tempData.filter((_, i) => i !== index);
    setTempData(newData);
    onDataChange?.(Object.fromEntries(newData));
  };

  const renderInput = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string
  ) => {
    return inputType === "js text" ? (
      <JsTextInput
        placeholder={placeholder}
        value={value}
        onValueChange={(e) => onChange(e)}
      />
    ) : (
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    );
  };

  return (
    <Stack>
      {tempData.map(([key, value], index) => (
        <Grid key={index} align="center">
          <Grid.Col span={5}>
            {renderInput(
              key,
              (newValue) => handleKeyValueChange(newValue, value, index),
              keyPlaceholder
            )}
          </Grid.Col>
          <Grid.Col span={6}>
            {renderInput(
              value,
              (newValue) => handleKeyValueChange(key, newValue, index),
              valuePlaceholder
            )}
          </Grid.Col>
          <Grid.Col span={1}>
            <ActionIcon color="red" onClick={() => handleDeletePair(index)}>
              <TbTrashFilled size={16} />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      ))}
      <Button
        color="violet"
        onClick={handleAddNewPair}
        fullWidth
        style={{ marginTop: "0.5rem" }}
      >
        {addButtonText}
      </Button>
    </Stack>
  );
};

export default KVPEditor;
