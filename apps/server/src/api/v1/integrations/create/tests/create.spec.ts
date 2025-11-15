import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import {
  createIntegration,
  getAppConfigKeys,
  integrationExistByName,
} from "../repository";
import handleRequest, { getAppConfigKeysFromData } from "../service";
import { db } from "../../../../../db";
import { publishMessage } from "../../../../../db/redis";
import { ConflictError } from "../../../../../errors/conflictError";
import { ServerError } from "../../../../../errors/serverError";
import { NotFoundError } from "../../../../../errors/notFoundError";

vi.mock("../repository");
vi.mock("../../../../../db", () => {
  return {
    db: {
      transaction: vi.fn(),
    },
  };
});
vi.mock("../../../../../db/redis");

const mockTransaction = vi.fn();
db.transaction = mockTransaction;

const mockCreateIntegration = vi.mocked(createIntegration);
const mockIntegrationExistByName = vi.mocked(integrationExistByName);
const mockGetAppConfigKeys = vi.mocked(getAppConfigKeys);
const mockPublishMessage = vi.mocked(publishMessage);

describe("createIntegration service", () => {
  const validInput = {
    name: "test-integration",
    group: "database" as const,
    variant: "PostgreSQL",
    config: { url: "postgres://localhost" },
  };

  const mockTx = {};

  beforeAll(() => {
    process.env.MASTER_ENCRYPTION_KEY = Buffer.from("a".repeat(32)).toString(
      "base64"
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockTransaction.mockImplementation(async (callback) => {
      return await callback(mockTx);
    });
    mockIntegrationExistByName.mockResolvedValue(false);
    mockGetAppConfigKeys.mockResolvedValue([]);
    mockCreateIntegration.mockResolvedValue(undefined as any);
  });

  describe("handleRequest", () => {
    it("should create a new integration with valid input", async () => {
      const result = await handleRequest(validInput as any);

      expect(mockIntegrationExistByName).toHaveBeenCalledWith(
        validInput.name,
        mockTx
      );
      expect(mockCreateIntegration).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validInput.name,
          group: validInput.group,
          variant: validInput.variant,
          config: validInput.config,
        }),
        mockTx
      );
      expect(mockPublishMessage).toHaveBeenCalled();
      expect(result).toHaveProperty("id");
    });

    it("should throw ConflictError when integration already exists", async () => {
      mockIntegrationExistByName.mockResolvedValueOnce(true);

      await expect(handleRequest(validInput as any)).rejects.toThrow(
        ConflictError
      );
      expect(mockCreateIntegration).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError when app config key is not found", async () => {
      const inputWithConfigKey = {
        ...validInput,
        config: { url: "cfg:db_url" },
      };
      mockGetAppConfigKeys.mockResolvedValueOnce(["other_key"]);

      await expect(handleRequest(inputWithConfigKey as any)).rejects.toThrow(
        NotFoundError
      );
      expect(mockCreateIntegration).not.toHaveBeenCalled();
    });

    it("should throw ServerError when creation fails", async () => {
      mockTransaction.mockImplementationOnce(async () => null);

      await expect(handleRequest(validInput as any)).rejects.toThrow(
        ServerError
      );
    });

    it("should validate app config keys when config contains cfg: references", async () => {
      const inputWithMultipleKeys = {
        ...validInput,
        config: {
          url: "cfg:db_url",
          password: "cfg:db_password",
        },
      };
      mockGetAppConfigKeys.mockResolvedValueOnce(["db_url", "db_password"]);

      const result = await handleRequest(inputWithMultipleKeys as any);

      expect(mockGetAppConfigKeys).toHaveBeenCalledWith(mockTx);
      expect(result).toHaveProperty("id");
    });

    it("should skip app config validation when config is empty", async () => {
      const inputWithEmptyConfig = {
        ...validInput,
        config: {},
      };

      const result = await handleRequest(inputWithEmptyConfig as any);

      expect(mockGetAppConfigKeys).not.toHaveBeenCalled();
      expect(result).toHaveProperty("id");
    });
  });

  describe("getAppConfigKeysFromData", () => {
    it("should extract cfg: prefixed keys from flat config", () => {
      const config = {
        url: "cfg:db_url",
        password: "cfg:db_password",
        port: 5432,
      };

      const keys = getAppConfigKeysFromData(config);

      expect(keys).toEqual(["db_url", "db_password"]);
    });

    it("should extract cfg: keys from nested config", () => {
      const config = {
        connection: {
          url: "cfg:db_url",
          auth: {
            password: "cfg:db_password",
          },
        },
      };

      const keys = getAppConfigKeysFromData(config);

      expect(keys).toContain("db_url");
      expect(keys).toContain("db_password");
    });

    it("should return empty array for non-object input", () => {
      expect(getAppConfigKeysFromData("string")).toEqual([]);
      expect(getAppConfigKeysFromData(123)).toEqual([]);
      expect(getAppConfigKeysFromData(null)).toEqual([]);
    });

    it("should return empty array when no cfg: keys exist", () => {
      const config = {
        url: "postgres://localhost",
        port: 5432,
      };

      const keys = getAppConfigKeysFromData(config);

      expect(keys).toEqual([]);
    });

    it("should handle deeply nested structures", () => {
      const config = {
        level1: {
          level2: {
            level3: {
              key: "cfg:deep_key",
            },
          },
        },
      };

      const keys = getAppConfigKeysFromData(config);

      expect(keys).toContain("deep_key");
    });

    it("should handle arrays in config", () => {
      const config = {
        items: [{ value: "cfg:key1" }, { value: "cfg:key2" }],
      };

      const keys = getAppConfigKeysFromData(config);

      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
    });
  });
});
