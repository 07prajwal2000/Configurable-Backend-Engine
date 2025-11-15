import { Button } from "@mantine/core";
import React from "react";
import { TbDeviceFloppy } from "react-icons/tb";

type PropTypes = {
  label?: string;
  disabled?: boolean;
  loading?: boolean;
};

const SaveIntegrationButton = (props: PropTypes) => {
  return (
    <Button
      type="submit"
      disabled={props.disabled}
      loading={props.loading}
      leftSection={<TbDeviceFloppy size={15} />}
      color="violet"
    >
      {props.label || "Save"}
    </Button>
  );
};

export default SaveIntegrationButton;
