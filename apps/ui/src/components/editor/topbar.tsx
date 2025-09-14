import { Stack, Typography, Button, Alert } from "@mui/material";
import { MdSave } from "react-icons/md";
import { useBlockEditorContext } from "../../context/blockEditorContext";
import { useState } from "react";
import { useEdges, useNodes } from "@xyflow/react";
import { showToast } from "../toasts";

const Topbar = () => {
  const context = useBlockEditorContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nodes = useNodes();
  const edges = useEdges();

  async function saveChanges() {
    setLoading(true);
    setError(null);
    try {
      await context.changes.saveChanges(nodes, edges);
      showToast({
        type: "info",
        message: "Changes saved successfully!",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save changes";
      setError(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack direction="column" spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize={18}>Route Editor</Typography>
        <Button
          loading={loading}
          variant="outlined"
          disabled={
            context.changes.blocks.size === 0 &&
            context.changes.edges.size === 0
          }
          onClick={saveChanges}
          startIcon={<MdSave />}
          size="small"
        >
          Save Changes
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Stack>
  );
};

export default Topbar;
