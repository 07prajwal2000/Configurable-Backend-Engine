import { useAppConfig } from "@/context/appConfigPage";
import { ActionIcon } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { TbTrash } from "react-icons/tb";

const AppConfigDeleteButton = () => {
  const queryClient = useQueryClient();
  const { selectedItems } = useAppConfig();

  const handleDelete = useCallback(async () => {
    if (selectedItems.size === 0) return;

    const selectedIds = Array.from(selectedItems);
    console.log("Deleting items:", selectedIds);

    // Partial implementation - getting all selected IDs and handling loading states
    try {
      // TODO: Implement actual delete mutation
      // for (const id of selectedIds) {
      //   await appConfigService.delete(id);
      // }
      // Invalidate queries after deletion
      queryClient.invalidateQueries({
        queryKey: ["app-config", "list"],
      });
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  }, [selectedItems, queryClient]);

  return (
    <ActionIcon
      color="red"
      variant="light"
      disabled={selectedItems.size === 0}
      onClick={handleDelete}
    >
      <TbTrash />
    </ActionIcon>
  );
};

export default AppConfigDeleteButton;
