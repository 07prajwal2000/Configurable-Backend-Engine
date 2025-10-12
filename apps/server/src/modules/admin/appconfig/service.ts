import {
  createAppConfig,
  getAppConfigById,
  getAppConfigByKey,
  getAllAppConfigs,
  updateAppConfig,
  deleteAppConfig,
  getAppConfigNames,
} from "./repository";
import {
  AppConfigType,
  PaginationInput,
  CreateAppConfigInput,
  UpdateAppConfigInput,
  AppConfigResponse,
} from "./dto";
import { EncryptionService } from "./encryption";
import { HttpError } from "../../../errors/httpError";
import { CHAN_ON_APPCONFIG_CHANGE, publishMessage } from "../../../db/redis";

// Helper function to safely convert database result to AppConfigType
function convertDbResultToAppConfigType(dbResult: any): AppConfigType {
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
  await publishMessage(CHAN_ON_APPCONFIG_CHANGE, "");
  return formatAppConfigResponse(convertedResult);
}

export async function getAppConfigByIdService(
  id: number
): Promise<AppConfigResponse | null> {
  const result = await getAppConfigById(id);
  if (!result) return null;
  if (result.encoding_type !== "plaintext" && !result.isEncrypted) {
    result.value = EncryptionService.decodeData(
      result.value!,
      result.encoding_type!
    );
  }
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
        if (config.encoding_type !== "plaintext" && !config.isEncrypted)
          config.value = EncryptionService.decodeData(
            config.value!,
            config.encoding_type!
          );
        const converted = convertDbResultToAppConfigType(config);
        return formatAppConfigResponse(converted);
      }),
    };
  }
}

export async function listConfigNamesService() {
  return await getAppConfigNames();
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
    let isEncrypted = false;

    if (existingDb.isEncrypted || data.isEncrypted == true) isEncrypted = true;

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
  await publishMessage(CHAN_ON_APPCONFIG_CHANGE, "");
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
  await publishMessage(CHAN_ON_APPCONFIG_CHANGE, "");
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

// Helper function to format app config response with masked values
function formatAppConfigResponse(config: AppConfigType): AppConfigResponse {
  const decryptedValue = decryptAppConfigValue(config);
  const maskedValue = config.isEncrypted
    ? EncryptionService.maskValue(decryptedValue)
    : config.value;
  config.value = maskedValue;
  return {
    ...config,
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
