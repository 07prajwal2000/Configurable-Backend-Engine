import { Box, Button, Stack, Typography } from "@mui/material";
import type { QueryClient } from "@tanstack/react-query";
import type React from "react";
import { IoReload } from "react-icons/io5";
import { queryClient } from "../queryClient";

const QueryError: React.FC<
  React.PropsWithChildren<{
    error?: Error | string;
    showRetry: boolean;
    keys: string[];
    rqQueryClient?: QueryClient;
  }>
> = ({ children, error, showRetry, keys, rqQueryClient }) => {
  function onReloadClicked() {
    const client = rqQueryClient ?? queryClient;
    client.invalidateQueries({ queryKey: keys });
  }

  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ width: "100%" }}
      gap={2}
    >
      {children ? (
        children
      ) : (
        <>
          <Typography variant="h4" textTransform={"uppercase"} color="error">
            Error Occured
          </Typography>
          <Typography>
            {error?.toString() ?? "Something went wrong while loading the data"}
          </Typography>
        </>
      )}
      {showRetry && (
        <Button
          onClick={onReloadClicked}
          variant="outlined"
          size="small"
          startIcon={<IoReload />}
        >
          Retry
        </Button>
      )}
    </Stack>
  );
};

export default QueryError;
