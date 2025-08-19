import { Stack, Typography, Button } from "@mui/material";
import { MdSave } from "react-icons/md";
import { useBlockEditorContext } from "../../context/blockEditorContext";
import { useState } from "react";
import { useEdges, useNodes } from "@xyflow/react";

const Topbar = () => {
  const context = useBlockEditorContext();
  const [loading, setLoading] = useState(false);
  const nodes = useNodes();
  const edges = useEdges();

  async function saveChanges() {
    setLoading(true);
    try {
      await context.changes.saveChanges(nodes, edges);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography fontSize={18}>Top bar</Typography>
      <Button
        loading={loading}
        variant="outlined"
        disabled={
          context.changes.blocks.size === 0 && context.changes.edges.size === 0
        }
        onClick={saveChanges}
        startIcon={<MdSave />}
        size="small"
      >
        Save
      </Button>
    </Stack>
  );
};

export default Topbar;
