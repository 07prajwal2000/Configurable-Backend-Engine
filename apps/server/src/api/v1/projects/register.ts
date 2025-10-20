import { Hono } from "hono";
import createProjectRoute from "./create/route";
import getAllProjectRoute from "./get-all/route";
import updateProjectRoute from "./update/route";

export default {
  name: "routes",
  registerHandler(app: Hono) {
    const router = app.basePath("/projects");
    createProjectRoute(router);
    getAllProjectRoute(router);
    updateProjectRoute(router);
  },
};
