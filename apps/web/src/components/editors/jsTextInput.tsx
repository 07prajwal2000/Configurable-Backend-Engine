import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Modal,
  Paper,
  Text,
  TextInput,
  TextInputProps,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { IoLogoJavascript } from "react-icons/io";
import { TbX } from "react-icons/tb";
import JsEditorDialog from "../dialog/jsEditorDialog";

type Props = {
  jsEditBtnLabel?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  enableJs?: boolean;
};

const JsTextInput = ({ enableJs = true, ...props }: Props & TextInputProps) => {
  const [opened, { open, close }] = useDisclosure();
  const isJsValue =
    (typeof props.value === "string" && props.value.startsWith("js:")) || false;

  function onClearClicked() {
    props.onClear && props.onClear();
    props.onValueChange && props.onValueChange("");
  }

  function onChange(value: string, isJsValue?: boolean) {
    value = isJsValue ? `js:${value}` : value;
    props.onValueChange && props.onValueChange(value);
    isJsValue && close();
  }

  if (isJsValue) {
    return (
      <Box w={"100%"}>
        <Text fw={"500"} size="sm">
          {props.label}
        </Text>
        <Text c={"gray"} size="xs" my={2}>
          {props.description}
        </Text>
        <Paper withBorder p={"4"}>
          <Group>
            <Button flex={20} size="xs" color="violet" onClick={open} fullWidth>
              {props.jsEditBtnLabel || "View / Edit Js Expression"}
            </Button>
            <Tooltip label="Clear Js Expression" withArrow arrowSize={8}>
              <ActionIcon
                onClick={onClearClicked}
                flex={1}
                variant="transparent"
                color="violet"
                w={"100%"}
                h={"100%"}
              >
                <TbX />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Paper>
        <JsEditorDialog
          onClose={close}
          opened={opened}
          value={props.value!.toString().slice(3)}
          onSave={(val) => onChange(val, true)}
          title="Edit Js Expression"
        />
      </Box>
    );
  }

  return (
    <>
      <TextInput
        {...props}
        onChange={(e) => onChange(e.target.value, false)}
        rightSection={
          enableJs && (
            <ActionIcon color="violet" onClick={open}>
              <IoLogoJavascript />
            </ActionIcon>
          )
        }
      />
      <JsEditorDialog
        title="Edit Js Expression"
        onClose={close}
        opened={opened}
        onSave={(val) => onChange(val, true)}
        value={props.value?.toString() || ""}
      />
    </>
  );
};

export default JsTextInput;
