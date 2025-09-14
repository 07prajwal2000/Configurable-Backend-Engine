import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { MdAdd } from "react-icons/md";

import RouteTable from "../components/RouteTable";
import RouteFormModal from "../components/RouteFormModal";
import RouteDetailsModal from "../components/RouteDetailsModal";
import { routesService } from "../services";

type Route = {
  id: string;
  name?: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  createdAt: string;
};

type CreateRouteRequest = {
  name?: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
};

const RoutesList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

  // Fetch routes
  const {
    data: routes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: routesService.getAllRoutes,
  });

  // Create route mutation
  const createMutation = useMutation({
    mutationFn: routesService.createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setFormModalOpen(false);
    },
  });

  // Update route mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateRouteRequest }) =>
      routesService.updateRoute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setFormModalOpen(false);
      setSelectedRoute(null);
    },
  });

  // Delete route mutation
  const deleteMutation = useMutation({
    mutationFn: routesService.deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setDeleteDialogOpen(false);
      setRouteToDelete(null);
    },
  });

  const handleCreate = () => {
    setSelectedRoute(null);
    setFormModalOpen(true);
  };

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setFormModalOpen(true);
  };

  const handleDelete = (routeId: string) => {
    setRouteToDelete(routeId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (routeToDelete) {
      deleteMutation.mutate(routeToDelete);
    }
  };

  const handleOpenEditor = (routeId: string) => {
    navigate(`/editor/${routeId}`);
  };

  const handleViewDetails = (route: Route) => {
    setSelectedRoute(route);
    setDetailsModalOpen(true);
  };

  const handleFormSubmit = (data: CreateRouteRequest) => {
    if (selectedRoute) {
      updateMutation.mutate({ id: selectedRoute.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleFormClose = () => {
    setFormModalOpen(false);
    setSelectedRoute(null);
  };

  const handleDetailsClose = () => {
    setDetailsModalOpen(false);
    setSelectedRoute(null);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setRouteToDelete(null);
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error">
          Failed to load routes: {(error as Error).message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Routes
          </Typography>
          <Button
            variant="contained"
            startIcon={<MdAdd />}
            onClick={handleCreate}
          >
            Create Route
          </Button>
        </Box>

        <RouteTable
          routes={routes}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOpenEditor={handleOpenEditor}
          onViewDetails={handleViewDetails}
        />
      </Box>

      <RouteFormModal
        open={formModalOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedRoute}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <RouteDetailsModal
        open={detailsModalOpen}
        onClose={handleDetailsClose}
        route={selectedRoute}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this route? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoutesList;
