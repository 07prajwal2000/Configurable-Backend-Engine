import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type z from "zod";
import InputWithJs from "./inputWithJs";
import { conditionSchema, operatorSchema } from "@fluxify/lib";
import { useEffect, useState } from "react";
import { MdAddCircleOutline, MdDelete } from "react-icons/md";
import { JsEditorButton } from "./editor/jsDialogEditor";

export type SavedConditionsType = z.infer<typeof conditionSchema>;

interface ConditionsBuilderProps {
  defaultValue?: SavedConditionsType[];
  opened: boolean;
  onClose?: () => void;
  onSave?: (value: SavedConditionsType[]) => void;
}

const ConditionsBuilder = (props: ConditionsBuilderProps) => {
  const [conditions, setConditions] = useState<SavedConditionsType[]>(
    props.defaultValue || []
  );
  useEffect(() => {
    setConditions(props.defaultValue || []);
  }, [props.defaultValue]);

  function onSaveClicked() {
    props.onSave && props.onSave(conditions);
    props.onClose && props.onClose();
  }
  function close() {
    setConditions(props.defaultValue || []);
    props.onClose && props.onClose();
  }

  function addNewCondition() {
    setConditions([
      {
        chain: "and",
        lhs: "",
        operator: operatorSchema.enum.eq,
        rhs: "",
      },
    ]);
  }

  function addCondition(chain: "and" | "or") {
    setConditions((prev) => [
      ...prev,
      {
        chain,
        lhs: "",
        operator: operatorSchema.enum.eq,
        rhs: "",
      },
    ]);
  }

  function onDelete(index: number) {
    setConditions((prev) => prev.filter((_, i) => i != index));
  }

  function onConditionChange(condition: SavedConditionsType, index: number) {
    setConditions((prev) => {
      const newConditions = [...prev];
      newConditions[index] = condition;
      return newConditions;
    });
  }

  return (
    <Drawer anchor="bottom" open={props.opened} onClose={close}>
      <Box sx={{ p: 2 }}>
        <Stack direction={"column"} gap={4}>
          <Stack gap={1}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h5">Edit Conditions</Typography>
              {conditions.length == 0 && (
                <Button
                  startIcon={<MdAddCircleOutline />}
                  onClick={addNewCondition}
                  variant="outlined"
                  color="info"
                >
                  Add Condition
                </Button>
              )}
            </Stack>
            <Divider />
          </Stack>
          <Box maxHeight={"60vh"} py={1} sx={{ overflowY: "auto" }}>
            <Stack direction={"column"} gap={2}>
              {conditions.map((condition, index) => (
                <Grid key={index} container direction={"row"} gap={1}>
                  {condition.chain == "or" && (
                    <Grid size={12}>
                      <Divider>
                        <Typography>OR</Typography>
                      </Divider>
                    </Grid>
                  )}
                  {condition.operator != "js" && (
                    <Grid size={3}>
                      <InputWithJs
                        fullWidth
                        value={condition.lhs.toString()}
                        onChange={(value) =>
                          onConditionChange({ ...condition, lhs: value }, index)
                        }
                        variant="outlined"
                        label="LHS"
                        size="small"
                      />
                    </Grid>
                  )}
                  <Grid size={2}>
                    <FormControl fullWidth>
                      <InputLabel id="op">Operator</InputLabel>
                      <Select
                        labelId="op"
                        value={condition.operator}
                        label="Operator"
                        size="small"
                        onChange={(e) =>
                          onConditionChange(
                            { ...condition, operator: e.target.value },
                            index
                          )
                        }
                      >
                        {Object.values(operatorSchema.enum).map((x) => (
                          <MenuItem value={x}>{x.toUpperCase()}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {condition.operator != "js" && (
                    <Grid size={3}>
                      <InputWithJs
                        fullWidth
                        value={condition.rhs.toString()}
                        variant="outlined"
                        label="RHS"
                        size="small"
                        onChange={(value) =>
                          onConditionChange({ ...condition, rhs: value }, index)
                        }
                      />
                    </Grid>
                  )}
                  {condition.operator == "js" && (
                    <Grid size={4}>
                      <JsEditorButton
                        defaultValue={condition.js}
                        onSave={(value) =>
                          onConditionChange({ ...condition, js: value }, index)
                        }
                        title="Edit JavaScript Condition"
                      />
                    </Grid>
                  )}
                  <Grid size={1}>
                    <IconButton onClick={() => onDelete(index)} color="error">
                      <MdDelete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </Box>
          {conditions.length == 0 ? (
            <Stack gap={1}>
              <Typography
                fontSize={20}
                textAlign={"center"}
                color="textDisabled"
                textTransform={"uppercase"}
              >
                Add a new condition to edit
              </Typography>
            </Stack>
          ) : (
            <ButtonGroup fullWidth>
              <Button onClick={() => addCondition("and")}>
                Add AND (&) Condition
              </Button>
              <Button onClick={() => addCondition("or")}>
                Add OR (||) Condition
              </Button>
            </ButtonGroup>
          )}
          <Button onClick={onSaveClicked} variant="contained" color="success">
            Save
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default ConditionsBuilder;
