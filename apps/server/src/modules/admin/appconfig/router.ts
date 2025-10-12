import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import {
  createAppConfigSchema,
  updateAppConfigSchema,
  getAppConfigByIdSchema,
  paginationSchema,
} from "./dto";
import {
  createAppConfigService,
  getAppConfigByIdService,
  getAllAppConfigsService,
  updateAppConfigService,
  deleteAppConfigService,
  listConfigNamesService,
} from "./service";
import { HttpError } from "../../../errors/httpError";

export function mapAppConfigEndpoints(app: Hono) {
  // POST /admin/appconfig – Create a new app config
  app.post(
    "/appconfig",
    describeRoute({
      description: "Create a new app config",
      responses: {
        201: {
          description: "App config created successfully",
        },
        400: {
          description: "Invalid request data",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("json", createAppConfigSchema),
    async (c) => {
      try {
        const data = c.req.valid("json");
        const newConfig = await createAppConfigService(data);
        return c.json(newConfig, 201);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        console.log(error);

        throw new HttpError(500, "Failed to create app config");
      }
    }
  );

  // GET /admin/appconfig – Get all app configs with optional pagination, excluding value
  app.get(
    "/appconfig",
    describeRoute({
      description:
        "Get all app configs with optional pagination, excluding value",
      responses: {
        200: {
          description: "List of app configs",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("query", paginationSchema),
    async (c) => {
      try {
        const query = c.req.valid("query");
        const result = await getAllAppConfigsService(query);
        return c.json(result);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to get app configs");
      }
    }
  );

  app.get(
    "/appconfig/view-list",
    describeRoute({
      description: "Get all app config names for dropdowns",
      responses: {
        200: {
          description: "List of app config names",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      const list = await listConfigNamesService();
      return c.json(list);
    }
  );

  // GET /admin/appconfig/:id – Get app config by ID
  app.get(
    "/appconfig/:id",
    describeRoute({
      description: "Get app config by ID",
      responses: {
        200: {
          description: "App config details",
        },
        404: {
          description: "App config not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", getAppConfigByIdSchema),
    async (c) => {
      try {
        const id = c.req.param("id");
        const config = await getAppConfigByIdService(parseInt(id, 10));
        if (!config) {
          throw new HttpError(404, "App config not found");
        }
        return c.json(config);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to get app config");
      }
    }
  );

  // PUT /admin/appconfig/:id – Update app config by ID
  app.put(
    "/appconfig/:id",
    describeRoute({
      description: "Update app config by ID",
      responses: {
        200: {
          description: "App config updated successfully",
        },
        404: {
          description: "App config not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", getAppConfigByIdSchema),
    zValidator("json", updateAppConfigSchema),
    async (c) => {
      try {
        const id = c.req.param("id");
        const data = c.req.valid("json");
        const updatedConfig = await updateAppConfigService(
          parseInt(id, 10),
          data
        );
        if (!updatedConfig) {
          throw new HttpError(404, "App config not found");
        }
        return c.json(updatedConfig);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to update app config");
      }
    }
  );

  // DELETE /admin/appconfig/:id – Delete app config by ID
  app.delete(
    "/appconfig/:id",
    describeRoute({
      description: "Delete app config by ID",
      responses: {
        200: {
          description: "App config deleted successfully",
        },
        404: {
          description: "App config not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", getAppConfigByIdSchema),
    async (c) => {
      try {
        const id = c.req.param("id");
        const deletedConfig = await deleteAppConfigService(parseInt(id, 10));
        if (!deletedConfig) {
          throw new HttpError(404, "App config not found");
        }
        return c.json({ message: "App config deleted successfully" });
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to delete app config");
      }
    }
  );
}
