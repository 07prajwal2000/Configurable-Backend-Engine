import React, { useContext } from "react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbCookie } from "react-icons/tb";
import {
  Checkbox,
  Grid,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { DataSettingsProps } from "../../settingsDialog/blockSettingsDialog";
import z from "zod";
import { setHttpCookieBlockSchema } from "@fluxify/blocks";
import JsTextInput from "@/components/editors/jsTextInput";
import { BlockCanvasContext } from "@/context/blockCanvas";

const SetCookie = (props: NodeProps) => {
  const violetColor = useMantineTheme().colors.violet[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbCookie color={violetColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Set Cookie"
      labelPlacement="left"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

// write set cookie settings panel, need name, value, domain, path, expiry, httpOnly, secure, samesite (Lax, None (default), Strict)
export function SetCookieSettingsPanel(
  props: DataSettingsProps<z.infer<typeof setHttpCookieBlockSchema>>
) {
  const { updateBlockData } = useContext(BlockCanvasContext);

  const onNameChange = (value: string) => {
    updateBlockData(props.blockId, { name: value });
  };

  const onValueChange = (value: string) => {
    updateBlockData(props.blockId, { value: value });
  };

  const onDomainChange = (value: string) => {
    updateBlockData(props.blockId, { domain: value });
  };

  const onPathChange = (value: string) => {
    updateBlockData(props.blockId, { path: value });
  };

  const onExpiryChange = (value: string) => {
    updateBlockData(props.blockId, { expiry: value });
  };

  const onHttpOnlyChange = (value: boolean) => {
    updateBlockData(props.blockId, { httpOnly: value });
  };

  const onSecureChange = (value: boolean) => {
    updateBlockData(props.blockId, { secure: value });
  };

  const onSameSiteChange = (value: string | null) => {
    if (!value) return;
    updateBlockData(props.blockId, { samesite: value });
  };

  return (
    <Stack gap={"xs"}>
      <Grid>
        <Grid.Col span={6}>
          <JsTextInput
            label="Name"
            placeholder="Authorization"
            description="Name of the cookie"
            value={props.blockData.name}
            onValueChange={onNameChange}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <JsTextInput
            label="Value"
            placeholder="token-abcde"
            description="Value of the cookie"
            value={props.blockData.value}
            onValueChange={onValueChange}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <JsTextInput
            label="Domain"
            placeholder="example.com"
            description="Domain of the cookie"
            value={props.blockData.domain}
            onValueChange={onDomainChange}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <JsTextInput
            label="Path"
            placeholder="/api"
            description="Path of the cookie"
            value={props.blockData.path}
            onValueChange={onPathChange}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <JsTextInput
            label="Expiry"
            placeholder="2025-12-31T23:59:59"
            description="Expiry of the cookie"
            value={
              props.blockData.expiry.toLocaleString?.() ||
              props.blockData.expiry.toString()
            }
            onValueChange={onExpiryChange}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="SameSite"
            placeholder="Lax"
            description="SameSite of the cookie"
            value={props.blockData.samesite}
            onChange={onSameSiteChange}
            data={[
              { value: "None", label: "None" },
              { value: "Lax", label: "Lax" },
              { value: "Strict", label: "Strict" },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Checkbox
            label="HttpOnly"
            color="violet"
            description="Should the cookie be accessible only to server?"
            checked={props.blockData.httpOnly}
            onChange={(e) => onHttpOnlyChange(e.target.checked)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Checkbox
            label="Secure"
            color="violet"
            description="Should the cookie be sent over HTTPS?"
            checked={props.blockData.secure}
            onChange={(e) => onSecureChange(e.target.checked)}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default SetCookie;
