import { Hono } from "hono";
import registerGetAllRoute from "./get-all/route";
import registerGetByIdRoute from "./get-by-id/route";
import registerCreateRoute from "./create/route";
import registerUpdateRoute from "./update/route";
import registerDeleteRoute from "./delete/route";
import registerDeleteBulkRoute from "./delete-bulk/route";

export default {
  name: "app-config",
  registerHandler(app: Hono) {
    const router = app.basePath("/app-config");
    registerGetAllRoute(router);
    registerGetByIdRoute(router);
    registerCreateRoute(router);
    registerUpdateRoute(router);
    registerDeleteRoute(router);
    registerDeleteBulkRoute(router);
  },
};
