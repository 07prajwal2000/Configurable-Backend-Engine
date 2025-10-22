"use client";
import { routesQueries } from "@/query/routerQuery";
import { Breadcrumbs, Button, Loader, TextInput } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QueryLoader from "../query/queryLoader";
import { routesService } from "@/services/routes";
import { useDebouncedCallback } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { showErrorNotification } from "@/lib/errorNotifier";
import { notifications } from "@mantine/notifications";
import { TbUser, TbStack2 } from "react-icons/tb";

const UpdateRouteNameField = () => {
  const { id } = useParams();
  const { useQuery } = routesQueries.getById;
  const { data, isLoading } = useQuery(id?.toString() || "");
  const [name, setName] = React.useState(data?.name || "");
  const queryClient = useQueryClient();
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();

  const debouncedCallback = useDebouncedCallback(async (value: string) => {
    try {
      const { data: parsed, success } = routesService.createRequestSchema
        .pick({ name: true })
        .safeParse({ name: value });
      if (!success) return;

      await routesService.updatePartial(data?.id!, { name: parsed.name });
      routesQueries.invalidateAll(queryClient);
      notifications.show({
        message: "Route name updated",
        color: "green",
      });
    } catch (error: any) {
      setName(data?.name || "");
      showErrorNotification(error);
    } finally {
      setUpdateLoading(false);
    }
  }, 1200);

  useEffect(() => {
    setName(data?.name || "");
  }, [data?.name]);

  if (isLoading) return <QueryLoader skeletonsCols={1} skeletonsRows={1} />;

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUpdateLoading(true);
    setName(e.target.value);
    debouncedCallback(e.target.value);
  }

  function onProjectClick() {
    router.push(`/${data?.projectId}`);
  }

  const projectName =
    data?.projectName === "__personal" ? "Personal" : data?.projectName;
  const projectIcon = data?.projectName === "__personal" ? TbUser : TbStack2;
  return (
    <Breadcrumbs w={"100%"}>
      <Button
        leftSection={projectIcon({ size: 18 })}
        onClick={onProjectClick}
        variant="subtle"
        color="gray"
        size="xs"
      >
        {projectName}
      </Button>
      <TextInput
        size="xs"
        onChange={onChange}
        placeholder="Route Name"
        color="violet"
        value={name}
        rightSection={updateLoading ? <Loader size={18} color="violet" /> : ""}
      />
    </Breadcrumbs>
  );
};

export default UpdateRouteNameField;
