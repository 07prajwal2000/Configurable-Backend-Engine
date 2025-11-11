import { describe, it, expect, vi } from "vitest";
import { db } from "../../../../../db";
import { ConflictError } from "../../../../../errors/conflictError";
import { NotFoundError } from "../../../../../errors/notFoundError";
import { getRouteByNameOrPath, updateRoute } from "../repository";
import handleRequest from "../service";
import { HttpMethod } from "../../../../../db/schema";
import { publishMessage } from "../../../../../db/redis";

// Mock all imports
vi.mock("../../../../../db", () => ({
  db: {
    transaction: vi.fn(),
  },
}));
vi.mock("../../../../../db/redis", () => ({
  publishMessage: vi.fn(),
  CHAN_ON_ROUTE_CHANGE: "",
}));
vi.mock("../repository", () => ({
  getRouteByNameOrPath: vi.fn(),
  updateRoute: vi.fn(),
}));

describe("update route", () => {
  it("should return updated route if successful", async () => {
    (db.transaction as any).mockImplementation(async (callback: any) => {
      // mock tx object (not used in this test)
      const mockTx = {};
      return await callback(mockTx);
    });
    const mockRoute = {
      id: "123",
      name: "A",
      path: "/a",
      method: "GET" as HttpMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (getRouteByNameOrPath as any).mockResolvedValueOnce(mockRoute);
    (updateRoute as any).mockResolvedValueOnce(mockRoute);
    const result = await handleRequest("123", {
      name: "A",
      path: "/a",
      method: "GET" as HttpMethod,
      active: true,
    });
    expect(result).toEqual({
      id: "123",
      name: "A",
      path: "/a",
      method: "GET" as HttpMethod,
      createdAt: mockRoute.createdAt.toISOString(),
      updatedAt: mockRoute.updatedAt.toISOString(),
    });
  });
  it("should throw NotFoundError if route not found", async () => {
    (db.transaction as any).mockImplementation(async (callback: any) => {
      // mock tx object (not used in this test)
      const mockTx = {};
      return await callback(mockTx);
    });

    (getRouteByNameOrPath as any).mockResolvedValueOnce(null);

    await expect(
      handleRequest("123", {
        name: "A",
        path: "/a",
        method: "GET" as HttpMethod,
        active: true,
      })
    ).rejects.toThrowError(NotFoundError);
  });
  it("should throw ConflictError if route already exists", async () => {
    const mockRoute = {
      id: "123",
      name: "A",
      path: "/a",
      method: "GET" as HttpMethod,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (getRouteByNameOrPath as any).mockResolvedValueOnce({
      ...mockRoute,
      id: "234",
    });
    await expect(handleRequest("123", mockRoute)).rejects.toThrowError(
      ConflictError
    );
  });
});
