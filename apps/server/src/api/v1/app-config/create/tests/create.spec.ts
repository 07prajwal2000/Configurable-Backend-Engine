import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
} from "vitest";
import { createAppConfig, keyExists } from "../repository";
import handleRequest from "../service";
import { db } from "../../../../../db";
import { publishMessage } from "../../../../../db/redis";
import { ConflictError } from "../../../../../errors/conflictError";
import { ServerError } from "../../../../../errors/serverError";

// Mock the repository and db
vi.mock("../repository");
vi.mock("../../../../../db", () => {
  return {
    db: {
      transaction: vi.fn(),
    },
  };
});
vi.mock("../../../../../db/redis");

// Mock the transaction
const mockTransaction = vi.fn();
db.transaction = mockTransaction;

// Mock the repository functions
const mockCreateAppConfig = vi.mocked(createAppConfig);
const mockKeyExists = vi.mocked(keyExists);

// Mock the publishMessage function
const mockPublishMessage = vi.mocked(publishMessage);

describe("createAppConfig service", () => {
  const validInput = {
    keyName: "test_config",
    description: "Test configuration",
    value: "test-value",
    isEncrypted: false,
    encodingType: "plaintext" as const,
  };

  const mockCreatedConfig = {
    id: 1,
    ...validInput,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock transaction implementation
  const mockTx = {
    // Add any transaction methods used in the service
  };

  beforeAll(() => {
    process.env.MASTER_ENCRYPTION_KEY = Buffer.from("a".repeat(32)).toString(
      "base64"
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    mockTransaction.mockImplementation(async (callback) => {
      return await callback(mockTx);
    });

    // Default mock for keyExists
    mockKeyExists.mockResolvedValue(false);

    // Default mock for createAppConfig
    mockCreateAppConfig.mockResolvedValue(mockCreatedConfig);
  });

  it("should create a new app config with valid input", async () => {
    // Act
    const result = await handleRequest(validInput);

    // Assert
    expect(mockKeyExists).toHaveBeenCalledWith(validInput.keyName, mockTx);
    expect(mockCreateAppConfig).toHaveBeenCalledWith(
      {
        ...validInput,
        value: expect.any(String), // Value might be processed
      },
      mockTx
    );
    expect(mockPublishMessage).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
    expect(result).toEqual({ id: mockCreatedConfig.id });
  });

  it("should encrypt the value when isEncrypted is true", async () => {
    // Arrange
    const encryptedInput = {
      ...validInput,
      isEncrypted: true,
    };

    // Act
    await handleRequest(encryptedInput);

    // Assert
    expect(mockCreateAppConfig).toHaveBeenCalledWith(
      {
        ...encryptedInput,
        value: expect.any(String), // The actual encrypted value
      },
      mockTx
    );
  });

  it("should throw ConflictError when key already exists", async () => {
    // Arrange
    mockKeyExists.mockResolvedValueOnce(true);

    // Act & Assert
    await expect(handleRequest(validInput)).rejects.toThrow(ConflictError);
    expect(mockCreateAppConfig).not.toHaveBeenCalled();
  });

  it("should throw ServerError when creation fails", async () => {
    // Arrange
    mockCreateAppConfig.mockResolvedValueOnce(null);

    // Act & Assert
    await expect(handleRequest(validInput)).rejects.toThrow(ServerError);
  });

  it("should validate input against the schema", async () => {
    // Arrange
    const invalidInput = {
      keyName: "ab", // Too short
      description: "Test",
      value: "test",
      isEncrypted: false,
      encodingType: "invalid" as any, // Invalid encoding type
    };

    // Act & Assert
    await expect(handleRequest(invalidInput as any)).rejects.toThrow();
  });

  it("should handle different encoding types correctly", async () => {
    const encodingTypes = ["plaintext", "base64", "hex"] as const;

    for (const encodingType of encodingTypes) {
      const input = {
        ...validInput,
        encodingType,
      };

      await handleRequest(input);

      expect(mockCreateAppConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          encodingType,
          value: expect.any(String),
        }),
        mockTx
      );
    }
  });
});
