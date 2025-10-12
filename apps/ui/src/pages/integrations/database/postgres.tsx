import { Alert, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../queryClient";
import {
  IntegrationGroup,
  integrationsService,
  Variant,
} from "../../../services/integrations";
import QueryError from "../../../components/queryError";
import QueryLoading from "../../../components/queryLoading";
import type { PostgresDatabaseIntegrationConfig } from "../../../components/integrations/database/postgresFormEditor";
import PostgresFormEditor from "../../../components/integrations/database/postgresFormEditor";
import CreatePostgresIntegrationModal from "../../../components/integrations/database/createPostgresIntegrationModal";

const queryKey = `${(IntegrationGroup.Database, Variant.PostgreSQL)}_${
  Variant.PostgreSQL
}`;
const PostgresDatabaseIntegration = () => {
  const { data, isLoading, isError, error } = useQuery(
    {
      queryFn: () =>
        integrationsService.getAll<PostgresDatabaseIntegrationConfig>(
          IntegrationGroup.Database,
          Variant.PostgreSQL
        ),
      queryKey: [queryKey],
    },
    queryClient
  );

  if (isLoading) {
    return <QueryLoading />;
  }

  if (isError) {
    return <QueryError keys={[queryKey]} showRetry error={error!} />;
  }

  if (isLoading) {
    <Typography>Loading</Typography>;
  }

  return (
    <Stack gap={2} p={2}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant="h5">PostgreSQL Integrations</Typography>
        <CreatePostgresIntegrationModal keys={[queryKey]} />
      </Stack>
      <Alert severity="info">
        Using <b>cfg:</b> prefix for certain fields will load the app config
        with corresponding key name. <br /> E.g. <b>cfg:DB_PASS</b> will set
        appconfig value of DB_PASS to the field
      </Alert>

      <Stack direction={"column"} gap={1}>
        {data?.map((pgConfig, i) => (
          <PostgresFormEditor
            keys={[queryKey]}
            defaultOpened={i == 0}
            data={pgConfig}
            key={pgConfig.id}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default PostgresDatabaseIntegration;
