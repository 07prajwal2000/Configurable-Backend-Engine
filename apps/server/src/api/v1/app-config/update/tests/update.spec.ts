import { describe, it, expect, vi, beforeEach } from "vitest";
import handleRequest from "../service";
import * as repository from "../repository";
import { db } from "../../../../../db";
import { EncryptionService } from "../../../../../lib/encryption";
import { publishMessage } from "../../../../../db/redis";
import { BadRequestError } from "../../../../../errors/badRequestError";
import { NotFoundError } from "../../../../../errors/notFoundError";
import { ConflictError } from "../../../../../errors/conflictError";
import { ServerError } from "../../../../../errors/serverError";

vi.mock("../repository");
vi.mock("../../../../../db", () => ({
  db: {
    transaction: vi.fn(),
  },
}));
vi.mock("../../../../../lib/encryption");
vi.mock("../../../../../db/redis");

describe("Update App Config Service", () => {
  const mockTx = {};
  const mockConfig = {
    id: 1,
    keyName: "old_key",
    description: "old desc",
    value: "encoded_value",
    isEncrypted: false,
    encodingType: "plaintext" as const,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const mockTransaction = vi.fn(async (callback) => callback(mockTx));
    (db.transaction as any) = mockTransaction;
  });

  it("should successfully update app config with new value", async () => {
    const updateBody = {
      keyName: "old_key",
      description: "new desc",
      value: "new_value",
      isEncrypted: false,
      encodingType: "plaintext" as const,
    };
    const updatedConfig = { ...mockConfig, description: "new desc", value: "encoded_new_value", updatedAt: new Date() };

    (repository.getConfigById as any).mockResolvedValue(mockConfig);
    (repository.getConfigByKeyName as any).mockResolvedValue({ id: 1 });
    (EncryptionService.encodeData as any).mockReturnValue("encoded_new_value");
    (repository.updateAppConfig as any).mockResolvedValue(updatedConfig);
    (EncryptionService.maskValue as any).mockReturnValue("***");
    (publishMessage as any).mockResolvedValue(undefined);

    const result = await handleRequest(1, updateBody);

    expect(result.id).toBe(1);
    expect(result.description).toBe("new desc");
    expect(repository.getConfigById).toHaveBeenCalledWith(1, mockTx);
    expect(repository.updateAppConfig).toHaveBeenCalledWith(1, expect.any(Object), mockTx);
    expect(publishMessage).toHaveBeenCalled();
  });

  it("should throw NotFoundError when config does not exist", async () => {
    const updateBody = {
      keyName: "new_key",
      description: "desc",
      value: "value",
      isEncrypted: false,
      encodingType: "plaintext" as const,
    };

    (repository.getConfigById as any).mockResolvedValue(null);

    await expect(handleRequest(1, updateBody)).rejects.toThrow(NotFoundError);
    expect(repository.getConfigByKeyName).not.toHaveBeenCalled();
  });

  it("should throw ConflictError when key name already exists for different config", async () => {
    const updateBody = {
      keyName: "existing_key",
      description: "desc",
      value: "value",
      isEncrypted: false,
      encodingType: "plaintext" as const,
    };

    (repository.getConfigById as any).mockResolvedValue(mockConfig);
    (repository.getConfigByKeyName as any).mockResolvedValue({ id: 999 });

    await expect(handleRequest(1, updateBody)).rejects.toThrow(ConflictError);
    expect(repository.updateAppConfig).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError when trying to decrypt encrypted value", async () => {
    const encryptedConfig = { ...mockConfig, isEncrypted: true };
    const updateBody = {
      keyName: "old_key",
      description: "desc",
      value: "value",
      isEncrypted: false,
      encodingType: "plaintext" as const,
    };

    (repository.getConfigById as any).mockResolvedValue(encryptedConfig);

    await expect(handleRequest(1, updateBody)).rejects.toThrow(BadRequestError);
    expect(repository.updateAppConfig).not.toHaveBeenCalled();
  });

  it("should encrypt and encode value when isEncrypted is true", async () => {
    const updateBody = {
      keyName: "old_key",
      description: "desc",
      value: "secret",
      isEncrypted: true,
      encodingType: "base64" as const,
    };
    const updatedConfig = { ...mockConfig, isEncrypted: true, value: "encrypted_encoded", updatedAt: new Date() };

    (repository.getConfigById as any).mockResolvedValue(mockConfig);
    (repository.getConfigByKeyName as any).mockResolvedValue({ id: 1 });
    (EncryptionService.encrypt as any).mockReturnValue("encrypted");
    (EncryptionService.encodeData as any).mockReturnValue("encrypted_encoded");
    (repository.updateAppConfig as any).mockResolvedValue(updatedConfig);
    (EncryptionService.maskValue as any).mockReturnValue("***");
    (publishMessage as any).mockResolvedValue(undefined);

    await handleRequest(1, updateBody);

    expect(EncryptionService.encrypt).toHaveBeenCalledWith("secret");
    expect(EncryptionService.encodeData).toHaveBeenCalledWith("encrypted", "base64");
  });

  it("should handle encoding type change without value update", async () => {
    const updateBody = {
      keyName: "old_key",
      description: "desc",
      value: undefined,
      isEncrypted: false,
      encodingType: "hex" as const,
    };
    const configWithBase64 = { ...mockConfig, encodingType: "base64" as const };
    const updatedConfig = { ...configWithBase64, encodingType: "hex" as const, value: "hex_encoded", updatedAt: new Date() };

    (repository.getConfigById as any).mockResolvedValue(configWithBase64);
    (repository.getConfigByKeyName as any).mockResolvedValue({ id: 1 });
    (EncryptionService.decodeData as any).mockReturnValue("decoded_value");
    (EncryptionService.encodeData as any).mockReturnValue("hex_encoded");
    (repository.updateAppConfig as any).mockResolvedValue(updatedConfig);
    (EncryptionService.maskValue as any).mockReturnValue("***");
    (publishMessage as any).mockResolvedValue(undefined);

    await handleRequest(1, updateBody);

    expect(EncryptionService.decodeData).toHaveBeenCalledWith("encoded_value", "base64");
    expect(EncryptionService.encodeData).toHaveBeenCalledWith("decoded_value", "hex");
  });

  it("should throw ServerError when update fails", async () => {
    const updateBody = {
      keyName: "old_key",
      description: "desc",
      value: "value",
      isEncrypted: false,
      encodingType: "plaintext" as const,
    };

    (repository.getConfigById as any).mockResolvedValue(mockConfig);
    (repository.getConfigByKeyName as any).mockResolvedValue({ id: 1 });
    (EncryptionService.encodeData as any).mockReturnValue("encoded");
    (repository.updateAppConfig as any).mockResolvedValue(null);

    await expect(handleRequest(1, updateBody)).rejects.toThrow(ServerError);
    expect(publishMessage).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError when id is invalid", async () => {
    const updateBody = {
      keyName: "key",
      description: "desc",
      value: "value",
      isEncrypted: false,
      encodingType: "plaintext" as const,
    };

    await expect(handleRequest(0, updateBody)).rejects.toThrow(BadRequestError);
    await expect(handleRequest(NaN, updateBody)).rejects.toThrow(BadRequestError);
    expect(db.transaction).not.toHaveBeenCalled();
  });
});
