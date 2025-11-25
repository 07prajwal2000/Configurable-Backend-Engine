import React, { useContext } from "react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { LuDatabaseZap } from "react-icons/lu";
import { Stack, useMantineTheme } from "@mantine/core";
import z from "zod";
import { transactionDbBlockSchema } from "@fluxify/blocks";
import IntegrationSelector from "@/components/editors/integrationSelector";
import { BlockCanvasContext } from "@/context/blockCanvas";

const Transaction = (props: NodeProps) => {
  const green = useMantineTheme().colors.green;
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<LuDatabaseZap size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Database Transaction"
      labelPlacement="left"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Right}
        handleVariant="executor"
        color={green[8]}
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export const TransactionBlockDataSettingsPanel = (props: {
  blockData: z.infer<typeof transactionDbBlockSchema>;
  blockId: string;
}) => {
  const { updateBlockData } = useContext(BlockCanvasContext);

  function onIntegrationSelect(id: string) {
    updateBlockData(props.blockId, {
      connection: id,
    });
  }
  return (
    <Stack px={"xs"}>
      <IntegrationSelector
        group="database"
        label="Choose Database Connection"
        description="Select the database connection to start a transaction"
        selectedIntegration={props.blockData.connection}
        onSelect={onIntegrationSelect}
      />
    </Stack>
  );
};

export default Transaction;
