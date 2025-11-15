import { describe, it, expect, vi, beforeEach } from "vitest";
import handleRequest from "../service";
import { getIntegrationByID } from "../repository";
import { NotFoundError } from "../../../../../errors/notFoundError";

vi.mock("../repository");

const mockGetIntegrationByID = vi.mocked(getIntegrationByID);

describe("getIntegrationByID service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return integration when it exists", async () => {
    const mockIntegration = {
      id: "test-id",
      name: "postgres-prod",
      group: "database",
      variant: "PostgreSQL",
      config: { url: "postgres://prod" },
    };

    mockGetIntegrationByID.mockResolvedValueOnce(mockIntegration as any);

    const result = await handleRequest("test-id");

    expect(mockGetIntegrationByID).toHaveBeenCalledWith("test-id");
    expect(result).toEqual({
      id: "test-id",
      name: "postgres-prod",
      group: "database",
      variant: "PostgreSQL",
      config: { url: "postgres://prod" },
    });
  });

  it("should throw NotFoundError when integration does not exist", async () => {
    mockGetIntegrationByID.mockResolvedValueOnce(null);

    await expect(handleRequest("non-existent-id")).rejects.toThrow(NotFoundError);
    expect(mockGetIntegrationByID).toHaveBeenCalledWith("non-existent-id");
  });

  it("should map integration properties correctly", async () => {
    const mockIntegration = {
      id: "test-id",
      name: "test-integration",
      group: "kv",
      variant: "Redis",
      config: { host: "localhost", port: 6379 },
    };

    mockGetIntegrationByID.mockResolvedValueOnce(mockIntegration as any);

    const result = await handleRequest("test-id");

    expect(result).toHaveProperty("id", "test-id");
    expect(result).toHaveProperty("name", "test-integration");
    expect(result).toHaveProperty("group", "kv");
    expect(result).toHaveProperty("variant", "Redis");
    expect(result).toHaveProperty("config");
  });

  it("should handle different integration types", async () => {
    const integrations = [
      {
        id: "db-1",
        name: "postgres",
        group: "database",
        variant: "PostgreSQL",
        config: { url: "postgres://localhost" },
      },
      {
        id: "kv-1",
        name: "redis",
        group: "kv",
        variant: "Redis",
        config: { host: "localhost" },
      },
    ];

    for (const integration of integrations) {
      mockGetIntegrationByID.mockResolvedValueOnce(integration as any);
      const result = await handleRequest(integration.id);
      expect(result.group).toBe(integration.group);
      expect(result.variant).toBe(integration.variant);
    }
  });
});