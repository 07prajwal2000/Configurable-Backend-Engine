import { Hono } from "hono";
import { readFileSync } from "fs";
import { join } from "path";

// Cache for HTML content
let cachedHtmlContent: string | null = null;

// Function to load and cache HTML content
function loadHtmlContent(): string {
  if (cachedHtmlContent) {
    return cachedHtmlContent;
  }

  try {
    const htmlPath = join(process.cwd(), "src/public/openapi.html");
    cachedHtmlContent = readFileSync(htmlPath, "utf-8");
    return cachedHtmlContent;
  } catch (error) {
    throw new Error("OpenAPI UI file not found");
  }
}

const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Admin API",
    version: "1.0.0",
    description:
      "API for managing routes and blocks in the Configurable Backend Engine",
  },
  tags: [
    {
      name: "Routes",
      description: "Operations for managing API routes",
    },
    {
      name: "Blocks",
      description: "Operations for managing workflow blocks",
    },
  ],
  servers: [
    {
      url: "/_/admin",
      description: "Admin API server",
    },
  ],
  paths: {
    "/routes": {
      post: {
        tags: ["Routes"],
        summary: "Create a new route",
        operationId: "createRoute",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateRouteRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Route created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Route",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Routes"],
        summary: "Get all routes",
        operationId: "getAllRoutes",
        responses: {
          "200": {
            description: "List of routes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Route",
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/routes/{id}": {
      get: {
        tags: ["Routes"],
        summary: "Get route by ID",
        operationId: "getRouteById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Route ID",
          },
        ],
        responses: {
          "200": {
            description: "Route found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Route",
                },
              },
            },
          },
          "404": {
            description: "Route not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Routes"],
        summary: "Update route by ID",
        operationId: "updateRoute",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Route ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateRouteRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Route updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Route",
                },
              },
            },
          },
          "404": {
            description: "Route not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Routes"],
        summary: "Delete route by ID",
        operationId: "deleteRoute",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Route ID",
          },
        ],
        responses: {
          "200": {
            description: "Route deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SuccessMessage",
                },
              },
            },
          },
          "404": {
            description: "Route not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/blocks": {
      post: {
        tags: ["Blocks"],
        summary: "Create a new block",
        operationId: "createBlock",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateBlockRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Block created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Block",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Blocks"],
        summary: "Get all blocks",
        operationId: "getAllBlocks",
        responses: {
          "200": {
            description: "List of blocks",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Block",
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/blocks/{id}": {
      get: {
        tags: ["Blocks"],
        summary: "Get block by ID",
        operationId: "getBlockById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Block ID",
          },
        ],
        responses: {
          "200": {
            description: "Block found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Block",
                },
              },
            },
          },
          "404": {
            description: "Block not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Blocks"],
        summary: "Update block by ID",
        operationId: "updateBlock",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Block ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateBlockRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Block updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Block",
                },
              },
            },
          },
          "404": {
            description: "Block not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Blocks"],
        summary: "Delete block by ID",
        operationId: "deleteBlock",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Block ID",
          },
        ],
        responses: {
          "200": {
            description: "Block deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SuccessMessage",
                },
              },
            },
          },
          "404": {
            description: "Block not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/blocks/path/{path}": {
      get: {
        tags: ["Blocks"],
        summary: "Get block by route path",
        operationId: "getBlockByPath",
        parameters: [
          {
            name: "path",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Route path",
          },
        ],
        responses: {
          "200": {
            description: "Block found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Block",
                },
              },
            },
          },
          "404": {
            description: "Block not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Route: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the route",
          },
          name: {
            type: "string",
            description: "Name of the route",
          },
          path: {
            type: "string",
            description: "Path of the route",
          },
          method: {
            type: "string",
            enum: ["GET", "POST", "PUT", "DELETE"],
            description: "HTTP method",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Creation timestamp",
          },
        },
        required: ["id", "path", "method", "createdAt"],
      },
      CreateRouteRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the route",
          },
          path: {
            type: "string",
            description: "Path of the route",
          },
          method: {
            type: "string",
            enum: ["GET", "POST", "PUT", "DELETE"],
            description: "HTTP method",
          },
        },
        required: ["path", "method"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
          },
        },
        required: ["error"],
      },
      SuccessMessage: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Success message",
          },
        },
        required: ["message"],
      },
      Block: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the block",
          },
          type: {
            type: "string",
            description: "Type of the block",
          },
          position: {
            type: "object",
            description: "Position data for the block",
          },
          data: {
            type: "object",
            description: "Block data",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Creation timestamp",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp",
          },
          routeId: {
            type: "string",
            description: "Associated route ID",
          },
        },
        required: ["id", "type", "createdAt"],
      },
      CreateBlockRequest: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "Type of the block",
          },
          position: {
            type: "object",
            description: "Position data for the block",
          },
          data: {
            type: "object",
            description: "Block data",
          },
          routeId: {
            type: "string",
            description: "Associated route ID",
          },
        },
        required: ["type"],
      },
      UpdateBlockRequest: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "Type of the block",
          },
          position: {
            type: "object",
            description: "Position data for the block",
          },
          data: {
            type: "object",
            description: "Block data",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp",
          },
        },
        required: [],
      },
    },
  },
};

export function setupOpenAPI(app: Hono) {
  app.get("/_/admin/openapi.json", (c) => {
    return c.json(openapiSpec);
  });
  app.get("/_/admin/openapi/ui", (c) => {
    try {
      const htmlContent = loadHtmlContent();
      return c.html(htmlContent);
    } catch (error) {
      return c.text("OpenAPI UI file not found", 404);
    }
  });
}
