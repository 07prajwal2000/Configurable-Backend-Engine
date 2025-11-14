import { ActionIcon, Group, Input, Select } from "@mantine/core";
import React from "react";
import { TbCaretLeft, TbCaretRight } from "react-icons/tb";

interface PaginationProps {
  page: number;
  perPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  perPage,
  totalPages,
  onPageChange,
  onPerPageChange,
}) => {
  function handlePerPageChange(value: string | null) {
    if (!value) return;
    onPerPageChange(Number(value));
  }

  function handlePageChange(value: string) {
    const num = Number(value);
    if (!value || isNaN(num) || num <= 1 || num > totalPages) return;
    onPageChange(num);
  }

  function onDecrement() {
    if (page <= 1) return;
    onPageChange(page - 1);
  }

  function onIncrement() {
    if (page >= totalPages) return;
    onPageChange(page + 1);
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
        onChange={(e) => handlePageChange(e.target.value)}
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
        onChange={handlePerPageChange}
        data={["10", "20", "50"]}
        value={perPage.toString()}
        size="xs"
        w={80}
      />
    </Group>
  );
};

export default Pagination;
