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
    expect(parser.getRouteId("/api/users", "GET")).toBe("1");
  });
  it("should return route null no matching found", () => {
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
    expect(parser.getRouteId("/api/users/123", "GET")).toBe(null);
    expect(parser.getRouteId("/api/users", "POST")).toBe(null);
  });
});
