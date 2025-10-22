import { Hono } from "hono";
import registerGetAllRoute from "./get-all/route";
import registerGetByIdRoute from "./get-by-id/route";
import registerCreateRoute from "./create/route";
import registerUpdateRoute from "./update/route";
import registerDeleteRoute from "./delete/route";
import registerUpdatePartialRoute from "./update-partial/route";

export default {
  name: "routes",
  registerHandler(app: Hono) {
    const router = app.basePath("/routes");
    registerGetAllRoute(router);
    registerGetByIdRoute(router);
    registerCreateRoute(router);
    registerUpdateRoute(router);
    registerDeleteRoute(router);
    registerUpdatePartialRoute(router);
  },
};
