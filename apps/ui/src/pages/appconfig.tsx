import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  MdMoreVert,
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
} from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "../components/layout";
import AppConfigFormModal from "../components/AppConfigFormModal";
import { appconfigService } from "../services";
import type {
  AppConfigWithoutValue,
  PaginatedAppConfigsResponse,
  CreateAppConfigRequest,
  UpdateAppConfigRequest,
} from "../services/types";
import { showToast } from "../components/toasts";

const AppConfig = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedConfig, setSelectedConfig] =
    useState<AppConfigWithoutValue | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuConfig, setMenuConfig] = useState<AppConfigWithoutValue | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] =
    useState<AppConfigWithoutValue | null>(null);

  const queryClient = useQueryClient();

  // Fetch app configs with pagination
  const { data, isLoading, error } = useQuery({
    queryKey: ["appconfigs", page, rowsPerPage],
    queryFn: () =>
      appconfigService.getAllAppConfigs(
        page + 1,
        rowsPerPage
      ) as Promise<PaginatedAppConfigsResponse>,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAppConfigRequest) =>
      appconfigService.createAppConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appconfigs"] });
      showToast({
        message: "App config created successfully",
        type: "info",
      });
      setModalOpen(false);
    },
    onError: (error: any) => {
      showToast({
        message: error.response?.data?.error || "Failed to create app config",
        type: "error",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppConfigRequest }) =>
      appconfigService.updateAppConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appconfigs"] });
      showToast({
        message: "App config updated successfully",
        type: "info",
      });
      setModalOpen(false);
    },
    onError: (error: any) => {
      showToast({
        message: error.response?.data?.error || "Failed to update app config",
        type: "error",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => appconfigService.deleteAppConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appconfigs"] });
      showToast({
        message: "App config deleted successfully",
        type: "info",
      });
    },
    onError: (error: any) => {
      showToast({
        message: error.response?.data?.error || "Failed to delete app config",
        type: "error",
      });
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (
    mode: "create" | "edit" | "view",
    config?: AppConfigWithoutValue
  ) => {
    setModalMode(mode);
    setSelectedConfig(config || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedConfig(null);
  };

  const handleSubmit = (
    formData: CreateAppConfigRequest | UpdateAppConfigRequest
  ) => {
    if (modalMode === "create") {
      createMutation.mutate(formData as CreateAppConfigRequest);
    } else if (modalMode === "edit" && selectedConfig) {
      updateMutation.mutate({
        id: selectedConfig.id,
        data: formData as UpdateAppConfigRequest,
      });
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    config: AppConfigWithoutValue
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuConfig(config);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuConfig(null);
  };

  const handleMenuAction = (action: "view" | "edit" | "delete") => {
    if (!menuConfig) return;

    switch (action) {
      case "view":
        handleOpenModal("view", menuConfig);
        break;
      case "edit":
        handleOpenModal("edit", menuConfig);
        break;
      case "delete":
        setConfigToDelete(menuConfig);
        setDeleteDialogOpen(true);
        break;
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (configToDelete) {
      deleteMutation.mutate(configToDelete.id);
    }
    setDeleteDialogOpen(false);
    setConfigToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setConfigToDelete(null);
  };

  if (error) {
    return (
      <Layout>
        <Typography color="error">Error loading app configs</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            App Config
          </Typography>
          <Button
            variant="contained"
            startIcon={<MdAdd />}
            onClick={() => handleOpenModal("create")}
          >
            New Config
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Key Name</TableCell>
                <TableCell>Is Encrypted</TableCell>
                <TableCell>Encoding Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No app configs found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>{config.id}</TableCell>
                    <TableCell>{config.keyName}</TableCell>
                    <TableCell>
                      <Chip
                        label={config.isEncrypted ? "Yes" : "No"}
                        color={config.isEncrypted ? "warning" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={config.encoding_type}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, config)}>
                        <MdMoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {data && (
          <TablePagination
            component="div"
            count={data.pagination.totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
          />
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuAction("view")}>
            <MdVisibility style={{ marginRight: 8 }} />
            View
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction("edit")}>
            <MdEdit style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction("delete")}>
            <MdDelete style={{ marginRight: 8 }} />
            Delete
          </MenuItem>
        </Menu>

        <AppConfigFormModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedConfig}
          loading={createMutation.isPending || updateMutation.isPending}
          mode={modalMode}
        />

        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this app config? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default AppConfig;
