import { beforeEach, it, expect, describe } from "vitest";
import { HttpRouteParser } from "../routing/parser";

describe("Testing routing parser", () => {
  let parser = new HttpRouteParser();
  beforeEach(() => {
    parser = new HttpRouteParser();
  });

  it("should return route id when path and method match", () => {
    parser.buildRoutes([
      {
        routeId: "1",
        path: "/api/users",
        method: "GET",
      },
      {
        routeId: "2",
        path: "/api/posts",
        method: "GET",
      },
    ]);
    expect(parser.getRouteId("/api/users", "GET")?.id).toBe("1");
  });
  it("should return null when no matching found", () => {
    parser.buildRoutes([
      {
        routeId: "1",
        path: "/api/users",
        method: "GET",
      },
      {
        routeId: "2",
        path: "/api/posts",
        method: "GET",
      },
    ]);
    expect(parser.getRouteId("/api/users/123", "GET")).toBeNull();
    expect(parser.getRouteId("/api/users", "POST")).toBeNull();
  });
  it("should return route id with params", () => {
    parser.buildRoutes([
      {
        routeId: "1",
        path: "/api/users/:id",
        method: "GET",
      },
      {
        routeId: "333",
        path: "/api/posts/:id/comments",
        method: "GET",
      },
      {
        routeId: "2",
        path: "/api/posts",
        method: "GET",
      },
      {
        routeId: "555",
        path: "/api/:tenant/users/:id",
        method: "GET",
      },
    ]);
    const result = parser.getRouteId("/api/users/123", "GET");
    expect(result?.routeParams?.id).toBe("123");

    const result2 = parser.getRouteId("/api/posts/123/comments", "GET");
    expect(result2?.id).toBe("333");
    expect(result2?.routeParams?.id).toBe("123");

    const result3 = parser.getRouteId("/api/example_company/users/456", "GET");
    expect(result3?.id).toBe("555");
    expect(result3?.routeParams?.tenant).toBe("example_company");
    expect(result3?.routeParams?.id).toBe("456");
  });
});
