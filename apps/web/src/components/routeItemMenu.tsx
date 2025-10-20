import { isAxiosError } from "axios";
import { ActionIcon, Button, Group, Menu } from "@mantine/core";
import React, { useState } from "react";
import { TbCopy, TbDots, TbDownload, TbEdit, TbTrash } from "react-icons/tb";
import ConfirmDialog from "./dialog/confirmDialog";
import { useDisclosure } from "@mantine/hooks";
import { routesService } from "@/services/routes";
import { showErrorNotification } from "@/lib/errorNotifier";
import { routesQueries } from "@/query/routerQuery";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import FormDialog from "./dialog/formDialog";
import RouteForm from "./forms/routeForm";
import QueryLoader from "./query/queryLoader";
import QueryError from "./query/queryError";

type Proptypes = {
  id: string;
};

const RouteItemMenu = (props: Proptypes) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const client = useQueryClient();

  function onEditClicked() {
    openEdit();
  }
  function onDuplicateClicked() {}
  function onDownloadJsonClicked() {}
  async function onDeleteConfirm() {
    try {
      await routesService.delete(props.id);
      routesQueries.getAll.invalidate(client);
      notifications.show({
        message: "Successfully deleted",
        color: "green",
      });
    } catch (error: any) {
      showErrorNotification(error);
    }
    close();
  }

  return (
    <>
      <Menu position="bottom-end" width={200} shadow="md">
        <Menu.Target>
          <ActionIcon variant="subtle" color="dark">
            <TbDots size={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={onEditClicked} leftSection={<TbEdit size={20} />}>
            Edit
          </Menu.Item>
          <Menu.Item leftSection={<TbCopy size={20} />}>Duplicate</Menu.Item>
          <Menu.Item leftSection={<TbDownload size={20} />}>JSON</Menu.Item>
          <Menu.Item
            onClick={open}
            color="red"
            leftSection={<TbTrash size={20} />}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
        <ConfirmDialog
          onConfirm={onDeleteConfirm}
          open={opened}
          onClose={close}
          title="Confirm Delete?"
        >
          Are you sure want to delete?
        </ConfirmDialog>
      </Menu>
      <FormDialog open={editOpened} onClose={closeEdit} title="Edit Route">
        <RouteEditForm id={props.id} close={closeEdit} />
      </FormDialog>
    </>
  );
};

function RouteEditForm({ id, close }: { id: string; close: () => void }) {
  const [saving, setSaving] = useState(false);
  const { data, isLoading, isError, error } =
    routesQueries.getById.useQuery(id);
  const client = useQueryClient();

  if (isLoading) {
    return <QueryLoader />;
  }
  if (isError) {
    return (
      <QueryError
        error={error!}
        refetcher={() => {
          routesQueries.getById.invalidate(client, id);
        }}
      />
    );
  }

  async function onUpdate(data: any) {
    try {
      setSaving(true);
      await routesService.update(id, data);
      routesQueries.getById.invalidate(client, id);
      routesQueries.getAll.invalidate(client);
      close();
    } catch (error: any) {
      showErrorNotification(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <RouteForm
      values={data}
      onSubmit={onUpdate}
      zodSchema={routesService.updateRequestSchema}
      actionSection={
        <Group mt={"xs"} gap={"xs"} justify="end">
          <Button
            loading={saving}
            type="submit"
            variant="outline"
            color="violet"
          >
            Update
          </Button>
          <Button onClick={close} variant="subtle" color="dark">
            Cancel
          </Button>
        </Group>
      }
    />
  );
}

export default RouteItemMenu;
