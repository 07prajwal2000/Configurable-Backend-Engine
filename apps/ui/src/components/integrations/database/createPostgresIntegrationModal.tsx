import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdAdd, MdSave } from "react-icons/md";
import PasswordField from "../../fields/passwordField";
import { useForm } from "react-hook-form";
import { showToast } from "../../toasts";
import type { PostgresDatabaseIntegrationConfig } from "./postgresFormEditor";
import {
  IntegrationGroup,
  integrationsService,
  Variant,
} from "../../../services/integrations";
import { queryClient } from "../../../queryClient";

const CreatePostgresIntegrationModal: React.FC<{ keys: string[] }> = ({
  keys,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostgresDatabaseIntegrationConfig>({
    defaultValues: {
      name: "",
      host: "",
      port: "",
      dbType: "PostgreSQL",
      database: "",
      password: "",
      username: "",
    },
  });

  useEffect(reset, [showModal]);

  async function onSubmit(values: PostgresDatabaseIntegrationConfig) {
    try {
      setIsLoading(true);
      await integrationsService.create(
        IntegrationGroup.Database,
        Variant.PostgreSQL,
        values
      );
      queryClient.invalidateQueries({
        queryKey: keys,
      });
      showToast({
        message: "Successfully Created",
        type: "info",
      });
      toggleModal();
    } catch (error) {
      showToast({
        message: "Failed to Create",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function toggleModal() {
    setShowModal((p) => !p);
  }

  return (
    <>
      <Button
        startIcon={<MdAdd />}
        onClick={toggleModal}
        size="small"
        variant="outlined"
      >
        Add New
      </Button>
      <Dialog maxWidth="md" fullWidth open={showModal} onClose={toggleModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Create new PostgreSQL Integration</DialogTitle>
          <Divider />
          <DialogContent>
            <Stack gap={2}>
              <TextField
                fullWidth
                size="small"
                required
                error={!!errors.name}
                {...register("name", { required: true, minLength: 2 })}
                label={"Name"}
              />
              <Stack direction={"row"} gap={2}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  {...register("host", { required: true, minLength: 2 })}
                  error={!!errors.host}
                  label={"Host"}
                />
                <TextField
                  size="small"
                  fullWidth
                  required
                  {...register("port", { required: true, minLength: 2 })}
                  type="number"
                  error={!!errors.port}
                  label={"Port"}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>
                <TextField
                  fullWidth
                  required
                  error={!!errors.username}
                  size="small"
                  {...register("username", { required: true, minLength: 2 })}
                  label={"Username"}
                />
                <PasswordField
                  size="small"
                  error={!!errors.password}
                  fullWidth
                  required
                  {...register("password", { required: true, minLength: 2 })}
                  type="password"
                  label={"Password"}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>
                <TextField
                  fullWidth
                  size="small"
                  required
                  error={!!errors.database}
                  {...register("database", { required: true, minLength: 2 })}
                  label={"Database"}
                />
                <Box width={"100%"} />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              loading={isLoading}
              variant="outlined"
              startIcon={<MdSave />}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default CreatePostgresIntegrationModal;
