import { Tooltip } from "@mui/material";
import type { ReactNode } from "react";
import { MdHelpOutline } from "react-icons/md";

type HelpTextProps = {
  children?: string | ReactNode;
  iconSize?: number;
};

const HelpText = (props: HelpTextProps) => {
  return (
    <Tooltip title={props.children}>
      <MdHelpOutline size={props.iconSize || 30} />
    </Tooltip>
  );
};

export default HelpText;
