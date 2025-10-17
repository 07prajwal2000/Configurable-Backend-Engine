import {
  ActionIcon,
  Card,
  Center,
  Grid,
  Group,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import HttpMethodText from "./httpMethodText";
import { getTimeAgo } from "@/lib/datetime";
import { TbDots } from "react-icons/tb";
import RouteItemMenu from "./routeItemMenu";
import { useRouter } from "next/navigation";

type Proptypes = {
  id: string;
  name: string;
  method: string;
  path: string;
  updatedAt: string;
  createdAt: string;
  active: boolean;
};

const RouteItem = (props: Proptypes) => {
  const [active, setActive] = useState(props.active);
  const router = useRouter();

  function toggleActive() {
    setActive((p) => !p);
  }

  function onItemClick() {
    router.push(`/editor/${props.id}`);
  }

  return (
    <Card shadow="md" p={"xs"} withBorder>
      <Grid>
        <Grid.Col
          onClick={onItemClick}
          style={{ cursor: "pointer" }}
          my={"auto"}
          h={"100%"}
          span={1}
        >
          <Center dir="">
            <HttpMethodText method={props.method as any} />
          </Center>
        </Grid.Col>
        <Grid.Col onClick={onItemClick} style={{ cursor: "pointer" }} span={9}>
          <Stack gap={4}>
            <Text>{props.name}</Text>
            <Group gap={"xs"}>
              <Text size="xs" c={"gray"}>
                Updated {getTimeAgo(props.updatedAt)}
              </Text>
              <Text size="xs" c={"gray"}>
                |
              </Text>
              <Text size="xs" c={"gray"}>
                Created {getTimeAgo(props.createdAt)}
              </Text>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={1}>
          <Group my={"auto"} h={"100%"} gap={"xs"}>
            <Switch
              color="violet"
              label={active ? "Active" : "Inactive"}
              onChange={toggleActive}
              checked={active}
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={1} my={"auto"} h={"100%"}>
          <Center>
            <RouteItemMenu id={props.id} />
          </Center>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default RouteItem;
