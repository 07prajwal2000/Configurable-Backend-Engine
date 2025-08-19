import { MdAdd, MdClose } from "react-icons/md";
import { useEditorUIStore } from "../../store/editorUIStore";
import { Box, Divider, Fab, Grid, Menu, Stack, TextField } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import BlockCategories from "../blocks/blockCategories";
import BlocksList from "../blocks/blocksList";
import { FaArrowRotateLeft } from "react-icons/fa6";

type AddBlockMenuProps = {
  onAddNewBlock: (type: string, position: { x: number; y: number }) => void;
};

const AddBlockMenu = (props: AddBlockMenuProps) => {
  const { addBlockMenuOpen, setAddBlockMenuOpen } = useEditorUIStore();
  const [target, setTarget] = useState<HTMLButtonElement>(null!);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    setSearch("");
    setSelectedCategory("");
  }, [addBlockMenuOpen]);

  function toggleMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAddBlockMenuOpen(!addBlockMenuOpen);
    setTarget(e.currentTarget);
  }
  function getViewportCenter() {
    return screenToFlowPosition({
      x: (window.innerWidth - window.innerWidth * 0.3) / 2,
      y: window.innerHeight / 2,
    });
  }

  function resetSearch() {
    setSearch("");
    setSelectedCategory("");
  }

  async function onBlockSelect(block: string) {
    const position = getViewportCenter();
    props.onAddNewBlock(block, position);
    setAddBlockMenuOpen(false);
  }

  return (
    <Box>
      <Fab onClick={toggleMenu} size="small" color="primary">
        {addBlockMenuOpen ? <MdClose size={25} /> : <MdAdd size={25} />}
      </Fab>
      <Menu
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorEl={target}
        open={addBlockMenuOpen}
        onClose={() => setAddBlockMenuOpen(false)}
        sx={{
          height: "450px",
          width: "300px",
          overflowY: "none",
          mx: 2,
          top: "-10px",
        }}
      >
        <Stack direction={"column"} p={"8px"} gap={1} width={"250px"}>
          <Grid height={"40px"} container>
            <Grid size={10}>
              <TextField
                autoFocus
                onChange={(e) => setSearch(e.target.value)}
                label="Search Block"
                size="small"
                value={search}
              />
            </Grid>
            <Grid size={2}>
              <Fab onClick={resetSearch} size="small" color="info">
                <FaArrowRotateLeft size={20} />
              </Fab>
            </Grid>
          </Grid>
          <Divider />
          <Box height={"250px"}>
            {selectedCategory == "" && search == "" ? (
              <BlockCategories onClick={setSelectedCategory} />
            ) : (
              <>
                <BlocksList
                  filter={{
                    where: search != "" ? "name" : "category",
                    value: search || selectedCategory,
                  }}
                  onSelect={onBlockSelect}
                />
              </>
            )}
          </Box>
        </Stack>
      </Menu>
    </Box>
  );
};

export default AddBlockMenu;
