export type HttpRoute = {
  routeId: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
};

export class HttpRouteParser {
  private readonly routesTree: any = {};

  public buildRoutes(routes: HttpRoute[]) {
    for (const route of routes) {
      const pathSegments = route.path.split("/");
      let current = this.routesTree;
      for (const segment of pathSegments) {
        if (!current[segment]) {
          current[segment] = {};
        }
        current = current[segment];
      }
      current[route.method] = { "<ID>": route.routeId };
    }
  }
  // TODO: Add support for path parameters
  public getRouteId(path: string, method: HttpRoute["method"]): string | null {
    const pathSegments = path.split("/");
    let current = this.routesTree;
    for (const segment of pathSegments) {
      if (!current[segment]) {
        return null;
      }
      current = current[segment];
    }
    if (!current[method]) {
      return null;
    }
    return current[method]["<ID>"];
  }
}
