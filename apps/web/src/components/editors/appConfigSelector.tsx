import { appConfigQuery } from "@/query/appConfigQuery";
import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Popover,
  Select,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import React, { useState } from "react";
import { TbReload, TbSquareKey, TbX } from "react-icons/tb";
import QueryError from "../query/queryError";
import { useQueryClient } from "@tanstack/react-query";

type PropTypes = {
  value: string;
  label?: string;
  description?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

const AppConfigSelector = (props: PropTypes) => {
  const [value, setValue] = useState("");

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  function onSelectChange(val: string) {
    const value = "cfg:" + val;
    onValueChange(value);
  }
  function onValueChange(val: string) {
    setValue(val);
    props.onChange?.(val);
  }
  const isConfig = value.startsWith("cfg:");

  function clearValue() {
    onValueChange("");
  }

  return (
    <Paper w={"100%"}>
      {props.label && <Text>{props.label}</Text>}
      {props.description && (
        <Text size="xs" style={{ textWrap: "wrap" }} c={"gray"}>
          {props.description}
        </Text>
      )}
      <Group pr={"xs"} bd={"1px solid gray.4"} bdrs={"sm"}>
        {isConfig ? (
          <Group flex={1} c="white" bg={"violet.6"} p={2}>
            <Box px={"xs"} py={"3"} m={1} flex={1}>
              {value.slice(4)}
            </Box>
            <Tooltip label="Clear Value" withArrow arrowSize={8} color="dark">
              <ActionIcon onClick={clearValue} variant="subtle" color="white">
                <TbX />
              </ActionIcon>
            </Tooltip>
          </Group>
        ) : (
          <TextInput
            placeholder={props.placeholder}
            px={"xs"}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            variant="unstyled"
            flex={1}
          />
        )}
        <Popover>
          <Popover.Target>
            <Tooltip label="Open Key Selector" withArrow arrowSize={8}>
              <ActionIcon
                variant={isConfig ? "light" : "transparent"}
                color="violet"
              >
                <TbSquareKey size={20} />
              </ActionIcon>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown>
            <AppConfigSelectInput
              onChange={onSelectChange}
              value={isConfig ? value.slice(4) : value}
            />
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Paper>
  );
};

const AppConfigSelectInput = (props: {
  value: string;
  onChange?: (v: string) => void;
}) => {
  const { data, isLoading, isRefetching, isError } =
    appConfigQuery.getKeysList.useQuery("");
  const client = useQueryClient();

  function refetch() {
    appConfigQuery.getKeysList.invalidate("", client);
  }

  if (isError) {
    return (
      <QueryError
        stackGap="xs"
        overrideMessage="Failed to load app config keys"
        padding="sm"
        margin="xs"
        fontSize="xs"
        refetcher={refetch}
      />
    );
  }
  return (
    <Group align="end">
      <Select
        onChange={(e) => props.onChange?.(e!)}
        value={props.value}
        label="Choose Key"
        data={data}
      />
      <ActionIcon
        mb={3}
        variant="outline"
        color="violet"
        loading={isLoading || isRefetching}
        onClick={refetch}
      >
        <TbReload />
      </ActionIcon>
    </Group>
  );
};

export default AppConfigSelector;
