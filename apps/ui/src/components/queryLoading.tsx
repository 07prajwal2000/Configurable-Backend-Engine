import { Skeleton, Stack } from "@mui/material";

const QueryLoading = () => {
  return (
    <Stack justifyContent={"center"} justifyItems={"center"}>
      <Skeleton />
      <Skeleton />
    </Stack>
  );
};

export default QueryLoading;
