import { describe, it, expect, vi, beforeEach } from "vitest";
import handleRequest from "../service";
import { getRouteById } from "../repository";
import { NotFoundError } from "../../../../../errors/notFoundError";

// Mock the repository
vi.mock("../repository", () => ({
  getRouteById: vi.fn(),
}));

const mockGetRouteById = vi.mocked(getRouteById);

describe("handleRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the route with createdAt converted to ISO string when route exists", async () => {
    const mockRoute: any = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Route",
      path: "/test",
      method: "GET",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-01T00:00:00Z"),
    };
    mockGetRouteById.mockResolvedValue(mockRoute);

    const result = await handleRequest("123e4567-e89b-12d3-a456-426614174000");

    expect(result).toEqual({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Route",
      path: "/test",
      method: "GET",
      createdAt: mockRoute.createdAt.toISOString(),
      updatedAt: mockRoute.updatedAt.toISOString(),
    });
    expect(mockGetRouteById).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000"
    );
  });

  it("should throw NotFoundError when route does not exist", async () => {
    mockGetRouteById.mockResolvedValue(null);

    await expect(handleRequest("non-existent-id")).rejects.toThrow(
      NotFoundError
    );
    await expect(handleRequest("non-existent-id")).rejects.toThrow(
      "no route found with id: non-existent-id"
    );
    expect(mockGetRouteById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should handle route with null values correctly", async () => {
    const mockRoute: any = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: null,
      path: null,
      method: null,
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-01T00:00:00Z"),
    };
    mockGetRouteById.mockResolvedValue(mockRoute);

    const result = await handleRequest("123e4567-e89b-12d3-a456-426614174000");

    expect(result).toEqual({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: null,
      path: null,
      method: null,
      createdAt: mockRoute.createdAt.toISOString(),
      updatedAt: mockRoute.updatedAt.toISOString(),
    });
  });
});
