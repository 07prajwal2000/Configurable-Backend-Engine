import {
  createAppConfig,
  getAppConfigById,
  getAppConfigByKey,
  getAllAppConfigs,
  updateAppConfig,
  deleteAppConfig,
  deleteAppConfigByKey,
  upsertAppConfig,
  getAppConfigsByKeys,
  bulkCreateAppConfigs,
  bulkUpdateAppConfigs,
  bulkDeleteAppConfigs,
  getEncryptedAppConfigs,
  getAppConfigsByEncodingType,
} from "./repository";
import {
  AppConfigType,
  PaginationInput,
  CreateAppConfigInput,
  UpdateAppConfigInput,
  AppConfigResponse,
  validateEncodingValue,
} from "./dto";
import { AppConfigEncodingTypes } from "../../../db/schema";
import { EncryptionService } from "./encryption";
import { HttpError } from "../../../errors/httpError";

// Type guard to safely convert database result to AppConfigType
function isValidAppConfig(config: any): config is AppConfigType {
  return (
    config &&
    typeof config.id === "number" &&
    (typeof config.keyName === "string" || config.keyName === null) &&
    (typeof config.value === "string" || config.value === null) &&
    (typeof config.isEncrypted === "boolean" || config.isEncrypted === null) &&
    (["plaintext", "base64", "hex"].includes(config.encoding_type) ||
      config.encoding_type === null) &&
    (config.createdAt instanceof Date || config.createdAt === null) &&
    (config.updatedAt instanceof Date || config.updatedAt === null)
  );
}

// Helper function to safely convert database result to AppConfigType
function convertDbResultToAppConfigType(dbResult: any): AppConfigType {
  if (!isValidAppConfig(dbResult)) {
    throw new HttpError(500, "Invalid database result format");
  }

  // Validate required fields are not null
  if (
    dbResult.keyName === null ||
    dbResult.value === null ||
    dbResult.isEncrypted === null ||
    dbResult.encoding_type === null
  ) {
    throw new HttpError(500, "Required fields cannot be null");
  }

  return {
    id: dbResult.id,
    keyName: dbResult.keyName,
    description: dbResult.description || undefined,
    value: dbResult.value,
    isEncrypted: dbResult.isEncrypted,
    encoding_type: dbResult.encoding_type,
    createdAt: dbResult.createdAt || undefined,
    updatedAt: dbResult.updatedAt || undefined,
  };
}

export async function createAppConfigService(
  data: CreateAppConfigInput
): Promise<AppConfigResponse> {
  // Validate encoding compatibility
  if (!validateEncodingValue(data.value, data.encoding_type)) {
    throw new HttpError(
      400,
      `Invalid value for encoding type: ${data.encoding_type}`
    );
  }

  // Check if key already exists
  const existing = await getAppConfigByKey(data.keyName);
  if (existing) {
    throw new HttpError(
      409,
      `App config with key '${data.keyName}' already exists`
    );
  }

  // Process the value based on encryption and encoding
  let processedValue = data.value;
  if (data.isEncrypted) {
    // Encode first, then encrypt
    processedValue = EncryptionService.encodeData(
      data.value,
      data.encoding_type
    );
    processedValue = EncryptionService.encrypt(processedValue);
  } else {
    // Just encode if not encrypted
    processedValue = EncryptionService.encodeData(
      data.value,
      data.encoding_type
    );
  }

  const appConfigData: AppConfigType = {
    ...data,
    value: processedValue,
  };

  const result = await createAppConfig(appConfigData);
  const convertedResult = convertDbResultToAppConfigType(result);
  return formatAppConfigResponse(convertedResult);
}

export async function getAppConfigByIdService(
  id: number
): Promise<AppConfigResponse | null> {
  const result = await getAppConfigById(id);
  if (!result) return null;

  const convertedResult = convertDbResultToAppConfigType(result);
  return formatAppConfigResponse(convertedResult);
}

export async function getAppConfigByKeyService(
  keyName: string
): Promise<AppConfigResponse | null> {
  const result = await getAppConfigByKey(keyName);
  if (!result) return null;

  const convertedResult = convertDbResultToAppConfigType(result);
  return formatAppConfigResponse(convertedResult);
}

export async function getAllAppConfigsService(pagination?: PaginationInput) {
  const result = await getAllAppConfigs(pagination);

  if (Array.isArray(result)) {
    // No pagination
    return result.map((config) => {
      const converted = convertDbResultToAppConfigType(config);
      return formatAppConfigResponse(converted);
    });
  } else {
    // With pagination
    return {
      ...result,
      data: result.data.map((config) => {
        const converted = convertDbResultToAppConfigType(config);
        return formatAppConfigResponse(converted);
      }),
    };
  }
}

export async function updateAppConfigService(
  id: number,
  data: UpdateAppConfigInput
): Promise<AppConfigResponse | null> {
  // Check if config exists
  const existingDb = await getAppConfigById(id);
  if (!existingDb) {
    throw new HttpError(404, "App config not found");
  }

  const existing = convertDbResultToAppConfigType(existingDb);

  // Validate encoding compatibility if value is being updated
  if (
    data.value &&
    data.encoding_type &&
    !validateEncodingValue(data.value, data.encoding_type)
  ) {
    throw new HttpError(
      400,
      `Invalid value for encoding type: ${data.encoding_type}`
    );
  }

  // Check key uniqueness if keyName is being updated
  if (data.keyName && data.keyName !== existing.keyName) {
    const keyExists = await getAppConfigByKey(data.keyName);
    if (keyExists) {
      throw new HttpError(
        409,
        `App config with key '${data.keyName}' already exists`
      );
    }
  }

  // Process the value if it's being updated
  let processedValue = data.value;
  if (data.value !== undefined) {
    const encodingType = data.encoding_type || existing.encoding_type;
    const isEncrypted =
      data.isEncrypted !== undefined ? data.isEncrypted : existing.isEncrypted;

    if (isEncrypted) {
      // Encode first, then encrypt
      processedValue = EncryptionService.encodeData(data.value, encodingType);
      processedValue = EncryptionService.encrypt(processedValue);
    } else {
      // Just encode if not encrypted
      processedValue = EncryptionService.encodeData(data.value, encodingType);
    }
  }

  const updateData: Partial<AppConfigType> = {
    ...data,
    ...(processedValue !== undefined && { value: processedValue }),
  };

  const result = await updateAppConfig(id, updateData);
  if (!result) return null;

  return formatAppConfigResponse({
    id: result.id!,
    encoding_type: result.encoding_type!,
    isEncrypted: result.isEncrypted!,
    keyName: result.keyName!,
    value: result.value!,
    createdAt: result.createdAt!,
    description: result.description!,
    updatedAt: result.updatedAt!,
  });
}

export async function deleteAppConfigService(
  id: number
): Promise<AppConfigType | null> {
  const result = await deleteAppConfig(id);
  return {
    id: result.id!,
    encoding_type: result.encoding_type!,
    isEncrypted: result.isEncrypted!,
    keyName: result.keyName!,
    value: result.value!,
    createdAt: result.createdAt!,
    description: result.description!,
    updatedAt: result.updatedAt!,
  };
}

export async function deleteAppConfigByKeyService(
  keyName: string
): Promise<AppConfigType | null> {
  const result = await deleteAppConfigByKey(keyName);
  return {
    id: result.id!,
    encoding_type: result.encoding_type!,
    isEncrypted: result.isEncrypted!,
    keyName: result.keyName!,
    value: result.value!,
    createdAt: result.createdAt!,
    description: result.description!,
    updatedAt: result.updatedAt!,
  };
}

export async function upsertAppConfigService(
  data: CreateAppConfigInput
): Promise<AppConfigResponse> {
  // Validate encoding compatibility
  if (!validateEncodingValue(data.value, data.encoding_type)) {
    throw new HttpError(
      400,
      `Invalid value for encoding type: ${data.encoding_type}`
    );
  }

  // Process the value based on encryption and encoding
  let processedValue = data.value;
  if (data.isEncrypted) {
    // Encode first, then encrypt
    processedValue = EncryptionService.encodeData(
      data.value,
      data.encoding_type
    );
    processedValue = EncryptionService.encrypt(processedValue);
  } else {
    // Just encode if not encrypted
    processedValue = EncryptionService.encodeData(
      data.value,
      data.encoding_type
    );
  }

  const appConfigData: AppConfigType = {
    ...data,
    value: processedValue,
  };

  const result = await upsertAppConfig(appConfigData);
  const convertedResult = convertDbResultToAppConfigType(result);
  return formatAppConfigResponse(convertedResult);
}

export async function getDecryptedValueService(
  id: number
): Promise<string | null> {
  const config = await getAppConfigById(id);
  if (!config) return null;

  const convertedConfig = convertDbResultToAppConfigType(config);
  return decryptAppConfigValue(convertedConfig);
}

export async function getDecryptedValueByKeyService(
  keyName: string
): Promise<string | null> {
  const config = await getAppConfigByKey(keyName);
  if (!config) return null;

  const convertedConfig = convertDbResultToAppConfigType(config);
  return decryptAppConfigValue(convertedConfig);
}

export async function bulkCreateAppConfigsService(
  data: CreateAppConfigInput[]
): Promise<AppConfigResponse[]> {
  // Validate all items
  for (const item of data) {
    if (!validateEncodingValue(item.value, item.encoding_type)) {
      throw new HttpError(
        400,
        `Invalid value for encoding type: ${item.encoding_type} in item with key: ${item.keyName}`
      );
    }
  }

  // Process values
  const processedData = data.map((item) => {
    let processedValue = item.value;
    if (item.isEncrypted) {
      processedValue = EncryptionService.encodeData(
        item.value,
        item.encoding_type
      );
      processedValue = EncryptionService.encrypt(processedValue);
    } else {
      processedValue = EncryptionService.encodeData(
        item.value,
        item.encoding_type
      );
    }

    return {
      ...item,
      value: processedValue,
    };
  });

  const results = await bulkCreateAppConfigs(processedData);
  return results.map((config) => {
    const converted = convertDbResultToAppConfigType(config);
    return formatAppConfigResponse(converted);
  });
}

export async function bulkUpdateAppConfigsService(
  updates: Array<{ id: number; data: UpdateAppConfigInput }>
): Promise<AppConfigResponse[]> {
  const results = await bulkUpdateAppConfigs(updates);
  return results.map((config) => {
    const converted = convertDbResultToAppConfigType(config);
    return formatAppConfigResponse(converted);
  });
}

export async function bulkDeleteAppConfigsService(
  ids: number[]
): Promise<AppConfigType[]> {
  const results = await bulkDeleteAppConfigs(ids);
  return results.map(convertDbResultToAppConfigType);
}

// Helper function to format app config response with masked values
function formatAppConfigResponse(config: AppConfigType): AppConfigResponse {
  const decryptedValue = decryptAppConfigValue(config);
  const maskedValue = config.isEncrypted
    ? EncryptionService.maskValue(decryptedValue)
    : undefined;

  return {
    ...config,
    maskedValue,
    displayValue: config.isEncrypted ? maskedValue : decryptedValue,
  };
}

// Helper function to decrypt app config value
function decryptAppConfigValue(config: AppConfigType): string {
  if (!config.isEncrypted) {
    // Just decode if not encrypted
    return EncryptionService.decodeData(config.value, config.encoding_type);
  }

  try {
    // Decrypt first, then decode
    const decrypted = EncryptionService.decrypt(config.value);
    return EncryptionService.decodeData(decrypted, config.encoding_type);
  } catch (error) {
    throw new HttpError(500, "Failed to decrypt app config value");
  }
}

// Utility functions for specific use cases
export async function getAllEncryptedConfigsService(): Promise<
  AppConfigResponse[]
> {
  const results = await getEncryptedAppConfigs();
  return results.map((config) => {
    const converted = convertDbResultToAppConfigType(config);
    return formatAppConfigResponse(converted);
  });
}

export async function getConfigsByEncodingTypeService(
  encodingType: AppConfigEncodingTypes
): Promise<AppConfigResponse[]> {
  const results = await getAppConfigsByEncodingType(encodingType);
  return results.map((config) => {
    const converted = convertDbResultToAppConfigType(config);
    return formatAppConfigResponse(converted);
  });
}

export async function getConfigsByKeysService(
  keyNames: string[]
): Promise<AppConfigResponse[]> {
  const results = await getAppConfigsByKeys(keyNames);
  return results.map((config) => {
    const converted = convertDbResultToAppConfigType(config);
    return formatAppConfigResponse(converted);
  });
}
