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
        active: true,
        projectId: "proj1",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
      },
      {
        id: "2",
        name: "Route 2",
        path: "/route2",
        method: "POST",
        active: true,
        projectId: "proj1",
        createdAt: new Date("2023-01-02T00:00:00Z"),
        updatedAt: new Date("2023-01-02T00:00:00Z"),
      },
    ];
    mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 5 });

    const query = { page: 1, perPage: 2 } as any;
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
          active: true,
          projectId: "proj1",
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
        },
        {
          id: "2",
          name: "Route 2",
          path: "/route2",
          method: HttpMethod.POST,
          active: true,
          projectId: "proj1",
          createdAt: "2023-01-02T00:00:00.000Z",
          updatedAt: "2023-01-02T00:00:00.000Z",
        },
      ],
    });
    expect(mockGetRoutesList).toHaveBeenCalledWith(0, 2, expect.any(Object));
  });

  it("should handle first page correctly", async () => {
    const mockData = [
      {
        id: "1",
        name: "Route 1",
        path: "/route1",
        method: HttpMethod.GET,
        active: true,
        projectId: "proj1",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
      },
    ];
    mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

    const query = { page: 1, perPage: 10 } as any;
    const result = await handleRequest(query);

    expect(result.pagination).toEqual({
      hasNext: false,
      page: 1,
      totalPages: 1,
    });
    expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
  });

  it("should handle last page correctly", async () => {
    const mockData = [
      {
        id: "3",
        name: "Route 3",
        path: "/route3",
        method: HttpMethod.PUT,
        active: true,
        projectId: "proj1",
        createdAt: new Date("2023-01-03T00:00:00Z"),
        updatedAt: new Date("2023-01-03T00:00:00Z"),
      },
    ];
    mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 3 });

    const query = { page: 2, perPage: 2 } as any;
    const result = await handleRequest(query);

    expect(result.pagination).toEqual({
      hasNext: false,
      page: 2,
      totalPages: 2,
    });
    expect(mockGetRoutesList).toHaveBeenCalledWith(2, 2, expect.any(Object));
  });

  it("should handle empty results", async () => {
    mockGetRoutesList.mockResolvedValue({ result: [], totalCount: 0 });

    const query = { page: 1, perPage: 10 } as any;
    const result = await handleRequest(query);

    expect(result).toEqual({
      pagination: {
        hasNext: false,
        page: 1,
        totalPages: 0,
      },
      data: [],
    });
    expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
  });

  it("should calculate hasNext correctly when on middle page", async () => {
    const mockData = [
      {
        id: "1",
        name: "Route 1",
        path: "/route1",
        method: HttpMethod.GET,
        active: true,
        projectId: "proj1",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
      },
    ];
    mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 4 });

    const query = { page: 2, perPage: 2 } as any;
    const result = await handleRequest(query);

    expect(result.pagination.hasNext).toBe(true);
    expect(mockGetRoutesList).toHaveBeenCalledWith(2, 2, expect.any(Object));
  });

  describe("filter functionality", () => {
    it("should apply eq filter for string fields", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "name" as const,
          operator: "eq" as const,
          value: "Test Route",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Test Route");
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should apply like filter for string fields", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "name" as const,
          operator: "like" as const,
          value: "Test",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should apply eq filter for method field", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.POST,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "method" as const,
          operator: "eq" as const,
          value: "POST",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].method).toBe(HttpMethod.POST);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should convert boolean string values", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "active" as const,
          operator: "eq" as const,
          value: "true",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should convert numeric string values", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "id" as const,
          operator: "eq" as const,
          value: "123",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should apply neq filter", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "method" as const,
          operator: "neq" as const,
          value: "POST",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should apply gt filter", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "id" as const,
          operator: "gt" as const,
          value: "0",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should apply gte filter", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "id" as const,
          operator: "gte" as const,
          value: "1",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should apply lt filter", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "id" as const,
          operator: "lt" as const,
          value: "2",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should apply lte filter", async () => {
      const mockData = [
        {
          id: "1",
          name: "Test Route",
          path: "/test",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "id" as const,
          operator: "lte" as const,
          value: "1",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should return all records when no filter is provided", async () => {
      const mockData = [
        {
          id: "1",
          name: "Route 1",
          path: "/route1",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = { page: 1, perPage: 10 } as any;
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should return all records when filter field is missing", async () => {
      const mockData = [
        {
          id: "1",
          name: "Route 1",
          path: "/route1",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          operator: "eq" as const,
          value: "test",
        },
      } as any;
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should return all records when filter operator is missing", async () => {
      const mockData = [
        {
          id: "1",
          name: "Route 1",
          path: "/route1",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "name" as const,
          value: "test",
        },
      } as any;
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should return all records when filter value is missing", async () => {
      const mockData = [
        {
          id: "1",
          name: "Route 1",
          path: "/route1",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "name" as const,
          operator: "eq" as const,
        },
      } as any;
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });

    it("should return all records when invalid field is provided", async () => {
      const mockData = [
        {
          id: "1",
          name: "Route 1",
          path: "/route1",
          method: HttpMethod.GET,
          active: true,
          projectId: "proj1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ];
      mockGetRoutesList.mockResolvedValue({ result: mockData, totalCount: 1 });

      const query = {
        page: 1,
        perPage: 10,
        filter: {
          field: "invalidField" as any,
          operator: "eq" as const,
          value: "test",
        },
      };
      const result = await handleRequest(query);

      expect(result.data).toHaveLength(1);
      expect(mockGetRoutesList).toHaveBeenCalledWith(0, 10, expect.any(Object));
    });
  });
});
