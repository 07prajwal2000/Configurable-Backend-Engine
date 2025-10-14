import { describe, it, expect, vi, beforeEach } from "vitest";
import handleRequest from "../service";
import { getRoutesList } from "../repository";
import { HttpMethod } from "../../../../../db/schema";

// Mock the repository
vi.mock("../repository", () => ({
  getRoutesList: vi.fn(),
}));

const mockGetRoutesList = vi.mocked(getRoutesList);

describe("handleRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return paginated data with correct pagination info", async () => {
    const mockData: any[] = [
      {
        id: "1",
        name: "Route 1",
        path: "/route1",
        method: "GET",
        createdAt: new Date("2023-01-01T00:00:00Z"),
      },
      {
        id: "2",
        name: "Route 2",
        path: "/route2",
        method: "POST",
        createdAt: new Date("2023-01-02T00:00:00Z"),
      },
    ];
    mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 5 });

    const query = { page: 1, perPage: 2 };
    const result = await handleRequest(query);

    expect(result).toEqual({
      pagination: {
        hasNext: true,
        page: 1,
        totalPages: 3,
      },
      data: [
        {
          id: "1",
          name: "Route 1",
          path: "/route1",
          method: HttpMethod.GET,
          createdAt: "2023-01-01T00:00:00.000Z",
        },
        {
          id: "2",
          name: "Route 2",
          path: "/route2",
          method: HttpMethod.POST,
          createdAt: "2023-01-02T00:00:00.000Z",
        },
      ],
    });
    expect(mockGetRoutesList).toHaveBeenCalledWith(0, 2);
  });

  it("should handle first page correctly", async () => {
    const mockData = [
      {
        id: "1",
        name: "Route 1",
        path: "/route1",
        method: HttpMethod.GET,
        createdAt: new Date("2023-01-01T00:00:00Z"),
      },
    ];
    mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

    const query = { page: 1, perPage: 10 };
    const result = await handleRequest(query);

    expect(result.pagination).toEqual({
      hasNext: false,
      page: 1,
      totalPages: 1,
    });
    expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10);
  });

  it("should handle last page correctly", async () => {
    const mockData = [
      {
        id: "3",
        name: "Route 3",
        path: "/route3",
        method: HttpMethod.PUT,
        createdAt: new Date("2023-01-03T00:00:00Z"),
      },
    ];
    mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 3 });

    const query = { page: 2, perPage: 2 };
    const result = await handleRequest(query);

    expect(result.pagination).toEqual({
      hasNext: false,
      page: 2,
      totalPages: 2,
    });
    expect(mockGetRoutesList).toHaveBeenCalledWith(2, 2);
  });

  it("should handle empty results", async () => {
    mockGetRoutesList.mockResolvedValue({ result: [], totalCount: 0 });

    const query = { page: 1, perPage: 10 };
    const result = await handleRequest(query);

    expect(result).toEqual({
      pagination: {
        hasNext: false,
        page: 1,
        totalPages: 0,
      },
      data: [],
    });
    expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10);
  });

  it("should calculate hasNext correctly when on middle page", async () => {
    const mockData = [
      {
        id: "1",
        name: "Route 1",
        path: "/route1",
        method: HttpMethod.GET,
        createdAt: new Date("2023-01-01T00:00:00Z"),
      },
    ];
    mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 4 });

    const query = { page: 2, perPage: 2 };
    const result = await handleRequest(query);

    expect(result.pagination.hasNext).toBe(true);
    expect(mockGetRoutesList).toHaveBeenCalledWith(2, 2);
  });
});
