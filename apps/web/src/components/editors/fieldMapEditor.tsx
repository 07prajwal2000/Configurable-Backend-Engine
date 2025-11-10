import {
  ActionIcon,
  Button,
  Center,
  Grid,
  Stack,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import { TbLink, TbTrashFilled } from "react-icons/tb";

type PropTypes = {
  fieldMap: Record<string, string>;
  onKeyValueChange?: (data: Record<string, string>) => void;
};

const FieldMapEditor = (props: PropTypes) => {
  const [tempFieldMap, setTempFieldMap] = useState<[string, string][]>(
    Object.keys(props.fieldMap).map((key) => [key, props.fieldMap[key]])
  );

  function onKeyValueChange(key: string, value: string, index: number) {
    const newMap = [...tempFieldMap];
    newMap[index][0] = key;
    newMap[index][1] = value;
    setTempFieldMap(newMap);
    props.onKeyValueChange?.(generateFieldMap(newMap));
  }

  function onAddNewFieldMap() {
    const newMap = [...tempFieldMap];
    newMap.push(["", ""]);
    setTempFieldMap(newMap);
    props.onKeyValueChange?.(generateFieldMap(newMap));
  }

  function onDeleteFieldMap(index: number) {
    const newMap = [...tempFieldMap];
    newMap.splice(index, 1);
    setTempFieldMap(newMap);
    props.onKeyValueChange?.(generateFieldMap(newMap));
  }

  function generateFieldMap(list: [string, string][]) {
    const map: Record<string, string> = {};
    for (let i = 0; i < list.length; i++) {
      map[list[i][0]] = list[i][1];
    }
    return map;
  }

  function containsDuplicate(type: "key" | "value", value: string) {
    let count = 0;
    for (let i = 0; i < tempFieldMap.length; i++) {
      if (tempFieldMap[i][type === "key" ? 0 : 1] === value) {
        count++;
      }
      if (count > 1) {
        return "Duplicate " + type;
      }
    }
    return false;
  }

  return (
    <Stack>
      {tempFieldMap.map((kv, i) => (
        <Grid key={i}>
          <Grid.Col span={5}>
            <TextInput
              placeholder={"Source Field"}
              value={kv[0]}
              onChange={(e) => {
                onKeyValueChange(e.currentTarget.value, kv[1], i);
              }}
              error={containsDuplicate("key", kv[0])}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <Center h={"100%"}>
              <TbLink />
            </Center>
          </Grid.Col>
          <Grid.Col span={5}>
            <TextInput
              placeholder={"Destination Field"}
              value={kv[1]}
              onChange={(e) => {
                onKeyValueChange(kv[0], e.currentTarget.value, i);
              }}
              error={containsDuplicate("value", kv[1])}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <Center h={"100%"}>
              <ActionIcon color="red" onClick={() => onDeleteFieldMap(i)}>
                <TbTrashFilled />
              </ActionIcon>
            </Center>
          </Grid.Col>
        </Grid>
      ))}
      <Button color="violet" onClick={onAddNewFieldMap}>
        Add New Field Map
      </Button>
    </Stack>
  );
};

export default FieldMapEditor;
