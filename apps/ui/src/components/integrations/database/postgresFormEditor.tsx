import type React from "react";
import {
  IntegrationGroup,
  integrationsService,
  Variant,
  type BaseIntegration,
} from "../../../services/integrations";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MdDelete, MdExpandMore, MdSave } from "react-icons/md";
import { useForm } from "react-hook-form";
import PasswordField from "../../fields/passwordField";
import { PiPlugsConnected } from "react-icons/pi";
import { showToast } from "../../toasts";
import { useState } from "react";
import { queryClient } from "../../../queryClient";

export type PostgresDatabaseIntegrationConfig = {
  host: string;
  name: string;
  port: string;
  dbType: string;
  database: string;
  password: string;
  username: string;
};

const PostgresFormEditor: React.FC<{
  data: BaseIntegration<PostgresDatabaseIntegrationConfig>;
  defaultOpened?: boolean;
  keys: string[];
}> = ({ data, defaultOpened, keys }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { register, handleSubmit, watch } =
    useForm<PostgresDatabaseIntegrationConfig>({
      defaultValues: {
        name: data.name,
        host: data.config.host,
        port: data.config.port,
        dbType: data.config.dbType,
        database: data.config.database,
        password: data.config.password,
        username: data.config.username,
      },
    });

  async function onSubmit(values: PostgresDatabaseIntegrationConfig) {
    try {
      setIsLoading(true);
      await integrationsService.update(
        data.id,
        IntegrationGroup.Database,
        Variant.PostgreSQL,
        values
      );
      showToast({
        message: "Successfully Saved",
        type: "info",
      });
      await queryClient.invalidateQueries({
        queryKey: keys,
      });
    } catch (error) {
      showToast({
        message: "Failed to save",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function onTestConnectionClicked() {
    showToast({
      message: "Test Connection is not implemented yet",
      type: "error",
      title: "Not Implemented",
    });
  }

  function toggleDeleteConfirmation() {
    setShowDeleteConfirmation((p) => !p);
  }

  async function onDeleteConfirm() {
    try {
      await integrationsService.delete(data.id);
      toggleDeleteConfirmation();
      await queryClient.invalidateQueries({
        queryKey: keys,
      });
    } catch (error) {
      showToast({
        message: "Failed to delete",
        type: "error",
      });
    }
  }

  return (
    <Accordion defaultExpanded={defaultOpened}>
      <AccordionSummary expandIcon={<MdExpandMore />}>
        <Typography>{watch("name")}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2}>
            <TextField
              fullWidth
              size="small"
              required
              {...register("name", { required: true })}
              label={"Name"}
            />
            <Stack direction={"row"} gap={2}>
              <TextField
                fullWidth
                required
                size="small"
                {...register("host", { required: true })}
                label={"Host"}
              />
              <TextField
                size="small"
                fullWidth
                required
                {...register("port", { required: true })}
                type="number"
                label={"Port"}
              />
            </Stack>
            <Stack direction={"row"} gap={2}>
              <TextField
                fullWidth
                required
                size="small"
                {...register("username", { required: true })}
                label={"Username"}
              />
              <PasswordField
                size="small"
                fullWidth
                required
                {...register("password", { required: true })}
                type="password"
                label={"Password"}
              />
            </Stack>
            <Stack direction={"row"} gap={2}>
              <TextField
                fullWidth
                size="small"
                required
                {...register("database", { required: true, minLength: 2 })}
                label={"Database"}
              />
              <Box width={"100%"} />
            </Stack>
            <Stack direction={"row"} gap={2} justifyContent={"end"}>
              <Button
                loading={isLoading}
                type="submit"
                startIcon={<MdSave />}
                size="small"
                variant="outlined"
              >
                Save
              </Button>
              <Button
                onClick={onTestConnectionClicked}
                startIcon={<PiPlugsConnected />}
                size="small"
                color="secondary"
                variant="outlined"
              >
                Test Connection
              </Button>
              <IconButton
                onClick={toggleDeleteConfirmation}
                size="small"
                color="error"
              >
                <MdDelete />
              </IconButton>
            </Stack>
          </Stack>
        </form>
        <Dialog
          open={showDeleteConfirmation}
          onClose={toggleDeleteConfirmation}
        >
          <DialogTitle>Confirm Delete ?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure want to delete <b>{data.name}</b> integration ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<MdDelete />}
              color="error"
              variant="outlined"
              size="small"
              onClick={onDeleteConfirm}
            >
              Delete
            </Button>
            <Button onClick={toggleDeleteConfirmation} size="small">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </AccordionDetails>
    </Accordion>
  );
};

export default PostgresFormEditor;
