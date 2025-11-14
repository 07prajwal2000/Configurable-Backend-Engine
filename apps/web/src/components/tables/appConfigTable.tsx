import React, { useMemo } from "react";
import {
  Table,
  Checkbox,
  Box,
  Center,
  Loader,
  Stack,
  Text,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { TbCaretUp, TbCaretDown } from "react-icons/tb";
import { useAppConfig } from "@/context/appConfigPage";
import { appConfigService } from "@/services/appConfig";
import z from "zod";
import { getTimeAgo } from "@/lib/datetime";
import AppConfigTableEditButton from "../buttons/appConfigTableEditButton";

const schema = appConfigService.getAllResponseSchema.shape.data;

interface AppConfigTableProps {
  data: z.infer<typeof schema>;
  isLoading: boolean;
  onDelete: (ids: string[]) => void;
  isDeleting?: boolean;
}

const SORTABLE_COLUMNS = [
  "id",
  "keyName",
  "isEncrypted",
  "encodingType",
  "updatedAt",
  "createdAt",
];

const AppConfigTable: React.FC<AppConfigTableProps> = ({
  data,
  isLoading,
  onDelete,
  isDeleting = false,
}) => {
  const {
    selectedItems,
    selectItem,
    deselectItem,
    sortBy,
    sort,
    search,
    setSort,
    setSortBy,
  } = useAppConfig();

  const handleSelectAll = () => {
    if (selectedItems.size === data.length) {
      selectedItems.forEach((id) => deselectItem(id));
    } else {
      data.forEach((item) => selectItem(item.id.toString()));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.has(id)) {
      deselectItem(id);
    } else {
      selectItem(id);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSort("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sort === "asc" ? <TbCaretUp size={16} /> : <TbCaretDown size={16} />;
  };

  const renderHeaderCell = (
    label: string,
    columnKey: string,
    width?: string
  ) => {
    const isSortable = SORTABLE_COLUMNS.includes(columnKey);
    return (
      <Table.Th
        key={columnKey}
        style={{
          cursor: isSortable ? "pointer" : "default",
          userSelect: "none",
          position: "sticky",
          top: 0,
          backgroundColor: "#f8f9fa",
          zIndex: 10,
          width: width || "10%",
        }}
        onClick={() => isSortable && handleSort(columnKey)}
      >
        <Group gap={4} wrap="nowrap">
          <span>{label}</span>
          {isSortable && getSortIcon(columnKey)}
        </Group>
      </Table.Th>
    );
  };

  if (isLoading) {
    return (
      <Center py={40}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading configurations...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box
      style={{
        overflowX: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Table striped highlightOnHover style={{ tableLayout: "fixed" }}>
        <Table.Thead style={{ position: "sticky", top: 0, zIndex: 11 }}>
          <Table.Tr style={{ backgroundColor: "#f8f9fa" }}>
            <Table.Th
              style={{
                width: "50px",
                position: "sticky",
                top: 0,
                backgroundColor: "#f8f9fa",
                zIndex: 12,
              }}
            >
              <Checkbox
                color="violet"
                checked={data.length > 0 && selectedItems.size === data.length}
                indeterminate={
                  selectedItems.size > 0 && selectedItems.size < data.length
                }
                onChange={handleSelectAll}
              />
            </Table.Th>
            {renderHeaderCell("ID", "id", "10%")}
            {renderHeaderCell("Key Name", "keyName", "22%")}
            {renderHeaderCell("Encrypted", "isEncrypted", "8%")}
            {renderHeaderCell("Encoding Type", "encodingType", "15%")}
            {renderHeaderCell("Updated At", "updatedAt", "15%")}
            {renderHeaderCell("Created At", "createdAt", "15%")}
            <Table.Th style={{ width: "5%", textAlign: "center" }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item) => (
            <Table.Tr
              bg={selectedItems.has(item.id.toString()) ? "violet.1" : "white"}
              key={item.id}
            >
              <Table.Td style={{ width: "50px" }}>
                <Checkbox
                  color="violet"
                  checked={selectedItems.has(item.id.toString())}
                  onChange={() => handleSelectItem(item.id.toString())}
                />
              </Table.Td>
              <Table.Td>{item.id}</Table.Td>
              <Table.Td>{item.keyName}</Table.Td>
              <Table.Td>{item.isEncrypted ? "Yes" : "No"}</Table.Td>
              <Table.Td>{item.encodingType || "-"}</Table.Td>
              <Tooltip label={new Date(item.updatedAt).toLocaleString()}>
                <Table.Td>{getTimeAgo(item.updatedAt)}</Table.Td>
              </Tooltip>
              <Tooltip label={new Date(item.createdAt).toLocaleString()}>
                <Table.Td>{getTimeAgo(item.createdAt)}</Table.Td>
              </Tooltip>
              <Table.Td style={{ width: "50px", textAlign: "center" }}>
                <AppConfigTableEditButton id={item.id} />
              </Table.Td>
            </Table.Tr>
          ))}
          {data.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={8}>
                <Text ta="center" c="dimmed">
                  No configurations found for {search}
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default AppConfigTable;
