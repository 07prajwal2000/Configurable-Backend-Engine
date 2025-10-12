import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getVariantSchema, updateVariantSchema } from "./dto";
import { describeRoute } from "hono-openapi";
import {
  createIntegrationService,
  getIntegrationsService,
  updateIntegrationService,
  deleteIntegrationService,
  checkIntegrationService,
} from "./service";
import z from "zod";
import { HttpError } from "../../../errors/httpError";

const deleteSchema = z.object({
  id: z.string(),
});

export function mapIntegrationsEndpoint(app: Hono) {
  app.get(
    "/integrations/:group/:variant",
    describeRoute({
      description: "Get all integrations for a specific group and variant",
      responses: {
        200: {
          description: "List of integrations",
        },
        400: {
          description: "Invalid group",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", getVariantSchema),
    async (c) => {
      try {
        const { group, variant } = c.req.valid("param");
        const result = await getIntegrationsService(group, variant);
        return c.json(result);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to get integrations");
      }
    }
  );

  app.post(
    "/integrations/:group/:variant",
    describeRoute({
      description: "Create a new integration config",
      responses: {
        200: {
          description: "Integration created successfully",
        },
        400: {
          description: "Invalid request data",
        },
        409: {
          description: "Integration name already exists",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", getVariantSchema),
    async (c) => {
      try {
        const { group, variant } = c.req.valid("param");
        const config = await c.req.json();
        const result = await createIntegrationService(group, variant, config);
        return c.json(result);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to create integration");
      }
    }
  );

  app.put(
    "/integrations/:group/:variant/:id",
    describeRoute({
      description: "Update an existing integration config",
      responses: {
        200: {
          description: "Integration updated successfully",
        },
        400: {
          description: "Invalid request data",
        },
        404: {
          description: "Integration not found",
        },
        409: {
          description: "Integration name already exists",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", updateVariantSchema),
    async (c) => {
      try {
        const { group, variant, id } = c.req.valid("param");
        const config = await c.req.json();
        const result = await updateIntegrationService(
          group,
          variant,
          id,
          config
        );
        return c.json(result);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to update integration");
      }
    }
  );

  app.delete(
    "/integrations/:id",
    describeRoute({
      description: "Delete an integration by ID",
      responses: {
        200: {
          description: "Integration deleted successfully",
        },
        404: {
          description: "Integration not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", deleteSchema),
    async (c) => {
      try {
        const { id } = c.req.valid("param");
        const result = await deleteIntegrationService(id);
        return c.json(result);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to delete integration");
      }
    }
  );

  app.post(
    "/integrations/:group/:variant/check",
    describeRoute({
      description: "Validate integration config without creating",
      responses: {
        200: {
          description: "Validation successful",
        },
        400: {
          description: "Invalid request data",
        },
        500: {
          description: "Internal server error",
        },
      },
    }),
    zValidator("param", getVariantSchema),
    async (c) => {
      try {
        const { group, variant } = c.req.valid("param");
        const config = await c.req.json();
        const result = await checkIntegrationService(group, variant, config);
        return c.json(result);
      } catch (error) {
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(500, "Failed to check integration");
      }
    }
  );
}
