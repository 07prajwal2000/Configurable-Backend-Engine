import { Paper, Text, useMantineTheme } from "@mantine/core";
import React from "react";

type Proptypes = {
  method: "GET" | "POST" | "PUT" | "DELETE";
};

const HttpMethodText = (props: Proptypes) => {
  const { blue, green, grape, red } = useMantineTheme().colors;
  let color = blue[8];
  if (props.method === "POST") color = green[8];
  else if (props.method === "PUT") color = grape[8];
  else if (props.method === "DELETE") color = red[8];

  return (
    <Paper
      shadow="xs"
      w={"fit-content"}
      withBorder
      c={"white"}
      bg={color}
      ta={"center"}
      p={"xs"}
    >
      <Text fw={"600"} size={"xs"}>
        {props.method}
      </Text>
    </Paper>
  );
};

export default HttpMethodText;
