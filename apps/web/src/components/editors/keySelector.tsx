import { ActionIcon, Drawer, Group, Table, Text, Tooltip } from "@mantine/core";
import React from "react";
import { FaCaretRight } from "react-icons/fa6";

type Props = {
  title?: string;
  opened?: boolean;
  onClose: () => void;
  onSelect?: (key: string) => void;
  selectorKey: string;
  header: { label: string; name: string }[];
  data: Record<string, any>[];
  drawerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  closeOnSelect?: boolean;
};

const KeySelector = (props: Props) => {
  function onSelectClick(data: any) {
    props.onSelect?.(data);
    if (props.closeOnSelect) {
      props.onClose();
    }
  }

  return (
    <Drawer
      position="right"
      size={props.drawerSize}
      title={
        <Text size="lg" fw={"500"}>
          {props.title}
        </Text>
      }
      withCloseButton
      opened={props.opened ?? false}
      onClose={props.onClose}
    >
      <Table withRowBorders highlightOnHover striped>
        <Table.Thead>
          {props.header.map((header) => (
            <Table.Th>{header.label}</Table.Th>
          ))}
          <Table.Th />
        </Table.Thead>
        <Table.Tbody>
          {Object.keys(props.data).map((key) => {
            const item = props.data[key as any];
            return (
              <Table.Tr>
                {props.header.map((header) => (
                  <Table.Td>{item[header.name]}</Table.Td>
                ))}
                <Table.Td>
                  <Tooltip label="Choose">
                    <ActionIcon
                      onClick={() => onSelectClick(item[props.selectorKey])}
                      style={{ float: "right" }}
                      color="violet"
                    >
                      <FaCaretRight size={15} />
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Drawer>
  );
};

export default KeySelector;
