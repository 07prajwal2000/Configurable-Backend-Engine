import { isAxiosError, AxiosError } from "axios";
import { Button, Center, Stack, Text } from "@mantine/core";
import React from "react";

type PropTypes = {
  error?: Error;
  refetcher?: () => void;
  overrideMessage?: string;
};

const QueryError = (props: PropTypes) => {
  const isAxiosErr = isAxiosError(props.error);
  return (
    <Center p={"xl"} bd={"2px solid red"} m={"xl"} bdrs={"sm"}>
      <Stack ta={"center"}>
        <Text size="xl" fw={"500"} c={"red"}>
          Error Occured while loading
        </Text>
        {isAxiosErr &&
          (props.error as AxiosError<any>)?.response?.data?.type !==
            "validation" && (
            <Text size="xl" c={"gray"}>
              {props.overrideMessage
                ? props.overrideMessage
                : (props.error as AxiosError<any>)?.response?.data?.message}
            </Text>
          )}
        {props.refetcher && (
          <Button onClick={props.refetcher} variant="outline" color="violet">
            Reload
          </Button>
        )}
      </Stack>
    </Center>
  );
};

export default QueryError;
