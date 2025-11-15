import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
} from "vitest";
import handleRequest from "../service";
import {
  getIntegrationById,
  updateIntegration,
  integrationExistByName,
} from "../repository";
import { getAppConfigKeys } from "../../create/repository";
import { db } from "../../../../../db";
import { publishMessage } from "../../../../../db/redis";
import { NotFoundError } from "../../../../../errors/notFoundError";
import { ConflictError } from "../../../../../errors/conflictError";
import { ServerError } from "../../../../../errors/serverError";

vi.mock("../repository");
vi.mock("../../create/repository");
vi.mock("../../../../../db", () => {
  return {
    db: {
      transaction: vi.fn(),
    },
  };
});
vi.mock("../../../../../db/redis");
vi.mock("../../schemas", () => ({
  getSchema: vi.fn(() => ({
    safeParse: vi.fn(() => ({ success: true, data: {} })),
  })),
}));

const mockTransaction = vi.fn();
db.transaction = mockTransaction;

const mockGetIntegrationById = vi.mocked(getIntegrationById);
const mockUpdateIntegration = vi.mocked(updateIntegration);
const mockIntegrationExistByName = vi.mocked(integrationExistByName);
const mockGetAppConfigKeys = vi.mocked(getAppConfigKeys);
const mockPublishMessage = vi.mocked(publishMessage);

describe("updateIntegration service", () => {
  const mockTx = {};
  const integrationId = "test-id";
  const updateData = {
    name: "updated-integration",
    config: { url: "postgres://updated" },
  };

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
    mockGetAppConfigKeys.mockResolvedValue([]);
  });

  it("should successfully update an integration", async () => {
    const existingIntegration = {
      id: integrationId,
      name: "old-name",
      group: "database",
      variant: "PostgreSQL",
      config: { url: "postgres://old" },
    };

    const updatedIntegration = {
      ...existingIntegration,
      ...updateData,
    };

    mockGetIntegrationById.mockResolvedValueOnce(existingIntegration as any);
    mockIntegrationExistByName.mockResolvedValueOnce({ id: integrationId });
    mockUpdateIntegration.mockResolvedValueOnce([updatedIntegration] as any);

    const result = await handleRequest(integrationId, updateData as any);

    expect(mockGetIntegrationById).toHaveBeenCalledWith(integrationId, mockTx);
    expect(mockUpdateIntegration).toHaveBeenCalledWith(
      integrationId,
      updateData,
      mockTx
    );
    expect(mockPublishMessage).toHaveBeenCalled();
    expect(result).toEqual([updatedIntegration]);
  });

  it("should throw NotFoundError when integration does not exist", async () => {
    mockGetIntegrationById.mockResolvedValueOnce(null);

    await expect(handleRequest(integrationId, updateData as any)).rejects.toThrow(
      NotFoundError
    );
    expect(mockUpdateIntegration).not.toHaveBeenCalled();
  });

  it("should throw ConflictError when new name already exists", async () => {
    const existingIntegration = {
      id: integrationId,
      name: "old-name",
      group: "database",
      variant: "PostgreSQL",
      config: {},
    };

    mockGetIntegrationById.mockResolvedValueOnce(existingIntegration as any);
    mockIntegrationExistByName.mockResolvedValueOnce({ id: "different-id" });

    await expect(handleRequest(integrationId, updateData as any)).rejects.toThrow(
      ConflictError
    );
    expect(mockUpdateIntegration).not.toHaveBeenCalled();
  });

  it("should throw ServerError when update fails", async () => {
    const existingIntegration = {
      id: integrationId,
      name: "old-name",
      group: "database",
      variant: "PostgreSQL",
      config: {},
    };

    mockGetIntegrationById.mockResolvedValueOnce(existingIntegration as any);
    mockIntegrationExistByName.mockResolvedValueOnce({ id: integrationId });
    mockUpdateIntegration.mockResolvedValueOnce(null);

    await expect(handleRequest(integrationId, updateData as any)).rejects.toThrow(
      ServerError
    );
  });

  it("should allow updating with same name", async () => {
    const existingIntegration = {
      id: integrationId,
      name: "same-name",
      group: "database",
      variant: "PostgreSQL",
      config: { url: "postgres://old" },
    };

    const updateDataSameName = {
      name: "same-name",
      config: { url: "postgres://updated" },
    };

    const updatedIntegration = {
      ...existingIntegration,
      ...updateDataSameName,
    };

    mockGetIntegrationById.mockResolvedValueOnce(existingIntegration as any);
    mockIntegrationExistByName.mockResolvedValueOnce({ id: integrationId });
    mockUpdateIntegration.mockResolvedValueOnce([updatedIntegration] as any);

    const result = await handleRequest(integrationId, updateDataSameName as any);

    expect(result).toEqual([updatedIntegration]);
  });
});