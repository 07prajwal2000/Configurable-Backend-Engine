import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import {
  createAppConfigSchema,
  updateAppConfigSchema,
  getAppConfigByIdSchema,
  getAppConfigByKeySchema,
  paginationSchema,
} from "./dto";
import {
  createAppConfigService,
  getAppConfigByIdService,
  getAppConfigByKeyService,
  getAllAppConfigsService,
  updateAppConfigService,
  deleteAppConfigService,
  deleteAppConfigByKeyService,
  upsertAppConfigService,
  getDecryptedValueService,
  getDecryptedValueByKeyService,
  bulkCreateAppConfigsService,
  bulkUpdateAppConfigsService,
  bulkDeleteAppConfigsService,
  getAllEncryptedConfigsService,
  getConfigsByEncodingTypeService,
  getConfigsByKeysService,
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
        throw new HttpError(500, "Failed to create app config");
      }
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

  // GET /admin/appconfig/key/:keyName – Get app config by key name
  app.get(
    "/appconfig/key/:keyName",
    describeRoute({
      description: "Get app config by key name",
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
    zValidator("param", getAppConfigByKeySchema),
    async (c) => {
      try {
        const keyName = c.req.param("keyName");
        const config = await getAppConfigByKeyService(keyName);
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

  // GET /admin/appconfig – Get all app configs with optional pagination
  app.get(
    "/appconfig",
    describeRoute({
      description: "Get all app configs with optional pagination",
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

  // DELETE /admin/appconfig/key/:keyName – Delete app config by key name
  app.delete(
    "/appconfig/key/:keyName",
    describeRoute({
      description: "Delete app config by key name",
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
    zValidator("param", getAppConfigByKeySchema),
    async (c) => {
      try {
        const keyName = c.req.param("keyName");
        const deletedConfig = await deleteAppConfigByKeyService(keyName);
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

  // PUT /admin/appconfig – Upsert app config (create or update by key)
  app.put(
    "/appconfig",
    describeRoute({
      description: "Upsert app config (create or update by key)",
      responses: {
        200: {
          description: "App config upserted successfully",
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
        const result = await upsertAppConfigService(data);
        return c.json(result);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to upsert app config");
      }
    }
  );

  // GET /admin/appconfig/:id/decrypt – Get decrypted value by ID
  app.get(
    "/appconfig/:id/decrypt",
    describeRoute({
      description: "Get decrypted value by ID",
      responses: {
        200: {
          description: "Decrypted value",
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
        const decryptedValue = await getDecryptedValueService(parseInt(id, 10));
        if (decryptedValue === null) {
          throw new HttpError(404, "App config not found");
        }
        return c.json({ value: decryptedValue });
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to decrypt app config value");
      }
    }
  );

  // GET /admin/appconfig/key/:keyName/decrypt – Get decrypted value by key name
  app.get(
    "/appconfig/key/:keyName/decrypt",
    describeRoute({
      description: "Get decrypted value by key name",
      responses: {
        200: {
          description: "Decrypted value",
        },
        404: {
          description: "App config not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", getAppConfigByKeySchema),
    async (c) => {
      try {
        const keyName = c.req.param("keyName");
        const decryptedValue = await getDecryptedValueByKeyService(keyName);
        if (decryptedValue === null) {
          throw new HttpError(404, "App config not found");
        }
        return c.json({ value: decryptedValue });
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to decrypt app config value");
      }
    }
  );

  // POST /admin/appconfig/bulk – Bulk create app configs
  app.post(
    "/appconfig/bulk",
    describeRoute({
      description: "Bulk create app configs",
      responses: {
        201: {
          description: "Bulk create completed",
        },
        400: {
          description: "Invalid request data",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      try {
        const data = await c.req.json();
        if (!Array.isArray(data)) {
          throw new HttpError(400, "Request body must be an array");
        }

        const results = await bulkCreateAppConfigsService(data);
        return c.json({ message: "Bulk create completed", data: results }, 201);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to bulk create app configs");
      }
    }
  );

  // PUT /admin/appconfig/bulk – Bulk update app configs
  app.put(
    "/appconfig/bulk",
    describeRoute({
      description: "Bulk update app configs",
      responses: {
        200: {
          description: "Bulk update completed",
        },
        400: {
          description: "Invalid request data",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      try {
        const data = await c.req.json();
        if (!Array.isArray(data)) {
          throw new HttpError(
            400,
            "Request body must be an array of update objects"
          );
        }

        const results = await bulkUpdateAppConfigsService(data);
        return c.json({ message: "Bulk update completed", data: results });
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to bulk update app configs");
      }
    }
  );

  // DELETE /admin/appconfig/bulk – Bulk delete app configs
  app.delete(
    "/appconfig/bulk",
    describeRoute({
      description: "Bulk delete app configs",
      responses: {
        200: {
          description: "Bulk delete completed",
        },
        400: {
          description: "Invalid request data",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      try {
        const data = await c.req.json();
        if (!Array.isArray(data)) {
          throw new HttpError(400, "Request body must be an array of IDs");
        }

        const results = await bulkDeleteAppConfigsService(data);
        return c.json({
          message: "Bulk delete completed",
          deleted: results.length,
        });
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to bulk delete app configs");
      }
    }
  );

  // GET /admin/appconfig/encrypted – Get all encrypted app configs
  app.get(
    "/appconfig/encrypted",
    describeRoute({
      description: "Get all encrypted app configs",
      responses: {
        200: {
          description: "List of encrypted app configs",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      try {
        const results = await getAllEncryptedConfigsService();
        return c.json(results);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to get encrypted app configs");
      }
    }
  );

  // GET /admin/appconfig/encoding/:type – Get app configs by encoding type
  app.get(
    "/appconfig/encoding/:type",
    describeRoute({
      description: "Get app configs by encoding type",
      responses: {
        200: {
          description: "List of app configs by encoding type",
        },
        400: {
          description: "Invalid encoding type",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      try {
        const encodingType = c.req.param("type");
        if (!["plaintext", "base64", "hex"].includes(encodingType)) {
          throw new HttpError(400, "Invalid encoding type");
        }

        const results = await getConfigsByEncodingTypeService(
          encodingType as any
        );
        return c.json(results);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to get app configs by encoding type");
      }
    }
  );

  // POST /admin/appconfig/keys – Get app configs by multiple keys
  app.post(
    "/appconfig/keys",
    describeRoute({
      description: "Get app configs by multiple keys",
      responses: {
        200: {
          description: "List of app configs by keys",
        },
        400: {
          description: "Invalid request data",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    async (c) => {
      try {
        const data = await c.req.json();
        if (!Array.isArray(data)) {
          throw new HttpError(
            400,
            "Request body must be an array of key names"
          );
        }

        const results = await getConfigsByKeysService(data);
        return c.json(results);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to get app configs by keys");
      }
    }
  );
}
