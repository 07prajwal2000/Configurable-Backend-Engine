import { useRouterPagination } from "@/store/routes";
import React from "react";
import Pagination from "@/components/pagination/Pagination";

const RouterPagination = () => {
  const { page, perPage, totalPages, setPagination } = useRouterPagination();

  const handlePageChange = (newPage: number) => {
    setPagination(newPage, perPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPagination(page, newPerPage);
  };

  return (
    <Pagination
      page={page}
      perPage={perPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onPerPageChange={handlePerPageChange}
    />
  );
};

export default RouterPagination;
