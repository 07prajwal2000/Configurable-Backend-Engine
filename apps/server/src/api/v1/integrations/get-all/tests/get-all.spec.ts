import { describe, it, expect, vi, beforeEach } from "vitest";
import handleRequest from "../service";
import { getAllIntegrationsByGroup } from "../repository";

vi.mock("../repository");

const mockGetAllIntegrationsByGroup = vi.mocked(getAllIntegrationsByGroup);

describe("getAllIntegrations service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all integrations for a given group", async () => {
    const mockIntegrations = [
      {
        id: "1",
        name: "postgres-prod",
        group: "database",
        variant: "PostgreSQL",
        config: { url: "postgres://prod" },
      },
      {
        id: "2",
        name: "postgres-dev",
        group: "database",
        variant: "PostgreSQL",
        config: { url: "postgres://dev" },
      },
    ];

    mockGetAllIntegrationsByGroup.mockResolvedValueOnce(mockIntegrations as any);

    const result = await handleRequest("database");

    expect(mockGetAllIntegrationsByGroup).toHaveBeenCalledWith("database");
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "1",
      name: "postgres-prod",
      group: "database",
      variant: "PostgreSQL",
      config: { url: "postgres://prod" },
    });
  });

  it("should return empty array when no integrations exist for group", async () => {
    mockGetAllIntegrationsByGroup.mockResolvedValueOnce([]);

    const result = await handleRequest("kv");

    expect(result).toEqual([]);
    expect(mockGetAllIntegrationsByGroup).toHaveBeenCalledWith("kv");
  });

  it("should handle different groups", async () => {
    const groups = ["database", "kv", "ai", "baas"];

    for (const group of groups) {
      mockGetAllIntegrationsByGroup.mockResolvedValueOnce([]);
      await handleRequest(group);
      expect(mockGetAllIntegrationsByGroup).toHaveBeenCalledWith(group);
    }
  });

  it("should map integration properties correctly", async () => {
    const mockIntegration = {
      id: "test-id",
      name: "test-integration",
      group: "database",
      variant: "PostgreSQL",
      config: { url: "postgres://localhost", ssl: true },
    };

    mockGetAllIntegrationsByGroup.mockResolvedValueOnce([mockIntegration] as any);

    const result = await handleRequest("database");

    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("group");
    expect(result[0]).toHaveProperty("variant");
    expect(result[0]).toHaveProperty("config");
  });
});