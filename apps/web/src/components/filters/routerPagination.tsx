import { useRouterPagination } from "@/app/store/routes";
import { ActionIcon, Group, Input, Select } from "@mantine/core";
import React from "react";
import { TbCaretLeft, TbCaretRight } from "react-icons/tb";

const RouterPagination = () => {
  const { page, perPage, totalPages, setPagination } = useRouterPagination();

  function onPerPageChange(value: string | null) {
    if (!value) return;
    setPagination(page, Number(value));
  }

  function onPageChange(value: string) {
    const num = Number(value);
    if (!value || isNaN(num) || num <= 1 || num >= totalPages) return;
    setPagination(num, perPage);
  }
  function onDecrement() {
    if (page <= 1) return;
    setPagination(page - 1, perPage);
  }
  function onIncrement() {
    if (page >= totalPages) return;
    setPagination(page + 1, perPage);
  }

  return (
    <Group gap={5}>
      <ActionIcon
        onClick={onDecrement}
        disabled={page <= 1}
        color="violet"
        variant="outline"
      >
        <TbCaretLeft size={20} />
      </ActionIcon>
      <Input
        min={1}
        max={totalPages}
        onChange={(e) => onPageChange(e.target.value)}
        type="number"
        size="xs"
        w={50}
        value={page}
      />
      <ActionIcon
        onClick={onIncrement}
        disabled={page >= totalPages}
        color="violet"
        variant="outline"
      >
        <TbCaretRight size={20} />
      </ActionIcon>
      <Select
        onChange={onPerPageChange}
        data={["10", "20", "50"]}
        value={perPage.toString()}
        size="xs"
        w={80}
      />
    </Group>
  );
};

export default RouterPagination;
