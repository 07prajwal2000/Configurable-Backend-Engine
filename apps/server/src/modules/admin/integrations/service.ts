import {
  createIntegration,
  getIntegrationsByGroupAndVariant,
  getIntegrationById,
  updateIntegration,
  deleteIntegration,
  checkNameUniqueInGroupVariant,
  validateAppConfigIds,
} from "./repository";
import { integrationsGroupSchema, groupSchemaMap } from "./dto";
import { HttpError } from "../../../errors/httpError";
import z from "zod";

export interface UpdateIntegrationInput {
  config: Record<string, any>;
}

export async function createIntegrationService(
  group: string,
  variant: string,
  data: any
) {
  // Validate group and variant
  const groupResult = integrationsGroupSchema.safeParse(group);

  if (!groupResult.success) {
    throw new HttpError(400, "Invalid group");
  }

  const schemas =
    groupSchemaMap[group as z.infer<typeof integrationsGroupSchema>];
  if (!schemas) {
    throw new HttpError(400, "Invalid group");
  }

  // Find the schema for the variant
  const variantSchema = (schemas as any)[variant];

  if (!variantSchema) {
    throw new HttpError(400, "Invalid variant or config for the group");
  }

  // Validate the config using the schema
  const validationResult = variantSchema.safeParse(data);
  if (!validationResult.success) {
    throw new HttpError(400, "Invalid config for the group and variant");
  }

  // Check name uniqueness
  const name = data.name;
  const isUnique = await checkNameUniqueInGroupVariant(name, group, variant);
  if (!isUnique) {
    throw new HttpError(
      409,
      `Integration with name '${name}' already exists in this group and variant`
    );
  }

  // Validate app config ids
  const ids = extractIdsFromConfig(data);
  const idsValid = await validateAppConfigIds(ids);
  if (!idsValid) {
    throw new HttpError(400, "Some app config ids do not exist");
  }

  const result = await createIntegration({
    name,
    group,
    variant,
    config: data,
  });
  return result;
}

export async function getIntegrationsService(group: string, variant: string) {
  // Validate group
  const groupResult = integrationsGroupSchema.safeParse(group);
  if (!groupResult.success) {
    throw new HttpError(400, "Invalid group");
  }

  const result = await getIntegrationsByGroupAndVariant(group, variant);
  return result;
}

export async function updateIntegrationService(
  group: string,
  variant: string,
  id: string,
  config: Record<string, any>
) {
  // Validate group
  const groupResult = integrationsGroupSchema.safeParse(group);
  if (!groupResult.success) {
    throw new HttpError(400, "Invalid group");
  }

  const grp = groupResult.data;
  const schemas = groupSchemaMap[grp];
  if (!schemas) {
    throw new HttpError(400, "Invalid group");
  }

  // Validate config
  const variantSchema = (schemas as any)[variant];

  if (!variantSchema) {
    throw new HttpError(400, "Invalid config for the group and variant");
  }

  // Validate the config using the schema
  const validationResult = variantSchema.safeParse(config);
  if (!validationResult.success) {
    throw new HttpError(400, "Invalid config for the group and variant");
  }

  // Get existing integration
  const existing = await getIntegrationById(id);
  if (!existing) {
    throw new HttpError(404, "Integration not found");
  }

  // Check name uniqueness if name changed
  const newName = config.name;
  if (newName !== existing.name) {
    const isUnique = await checkNameUniqueInGroupVariant(
      newName,
      group,
      variant,
      id
    );
    if (!isUnique) {
      throw new HttpError(
        409,
        `Integration with name '${newName}' already exists in this group and variant`
      );
    }
  }

  // Validate app config ids
  const ids = extractIdsFromConfig(config);
  const idsValid = await validateAppConfigIds(ids);
  if (!idsValid) {
    throw new HttpError(400, "Some app config ids do not exist");
  }

  const result = await updateIntegration(id, { name: newName, config });
  return result;
}

export async function deleteIntegrationService(id: string) {
  const existing = await getIntegrationById(id);
  if (!existing) {
    throw new HttpError(404, "Integration not found");
  }

  await deleteIntegration(id);
  return existing;
}

export async function checkIntegrationService(
  group: string,
  variant: string,
  config: Record<string, any>
) {
  // Validate group
  const groupResult = integrationsGroupSchema.safeParse(group);
  if (!groupResult.success) {
    throw new HttpError(400, "Invalid group");
  }

  const grp = groupResult.data;
  const schemas = groupSchemaMap[grp];
  if (!schemas) {
    throw new HttpError(400, "Invalid group");
  }

  // Validate config
  const variantSchema = (schemas as any)[variant];

  if (!variantSchema) {
    throw new HttpError(400, "Invalid config for the group and variant");
  }

  // Validate the config using the schema
  const validationResult = variantSchema.safeParse(config);
  if (!validationResult.success) {
    throw new HttpError(400, "Invalid config for the group and variant");
  }

  // Validate app config ids
  const ids = extractIdsFromConfig(config);
  const idsValid = await validateAppConfigIds(ids);
  if (!idsValid) {
    throw new HttpError(400, "Some app config ids do not exist");
  }

  // Return success
  return { success: true };
}

function extractIdsFromConfig(config: Record<string, any>): number[] {
  const ids: number[] = [];
  for (const key in config) {
    const value = config[key];
    if (typeof value === "number") {
      ids.push(value);
    }
  }
  return ids;
}
