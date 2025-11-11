import { Hono } from "hono";
import routesRegister from "./routes/register";
import projectsRegister from "./projects/register";
import appConfigRegister from "./app-config/register";
import { openAPIRouteHandler } from "hono-openapi";

export default {
  name: "v1",
  registerHandler(app: Hono) {
    const router = app.basePath("/v1");
    router.get(
      "/openapi.json",
      openAPIRouteHandler(router, {
        documentation: {
          info: {
            title: "CBE API",
            version: "v1",
            description: "CBE API Documentation",
          },
        },
      })
    );
    routesRegister.registerHandler(router);
    projectsRegister.registerHandler(router);
    appConfigRegister.registerHandler(router);
  },
};
