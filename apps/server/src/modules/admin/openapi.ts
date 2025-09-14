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
    {
      name: "Edges",
      description: "Operations for managing workflow edges",
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
    "/routes/{id}/bulk": {
      post: {
        tags: ["Routes"],
        summary: "Bulk operations for blocks and edges",
        operationId: "bulkOperation",
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
                $ref: "#/components/schemas/BulkOperationRequest",
              },
            },
          },
        },
        description:
          "Perform bulk operations (create, update, delete) on blocks and edges for a specific route. Operations are executed in transactions to ensure data consistency.",
        responses: {
          "200": {
            description: "Bulk operation completed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BulkOperationResponse",
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
        summary: "Get all blocks with pagination",
        operationId: "getAllBlocks",
        parameters: [
          {
            name: "perPage",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 10,
              maximum: 50,
              default: 20,
            },
            description: "Number of blocks per page (10-50)",
          },
          {
            name: "pageNumber",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            description: "Page number (starts from 1)",
          },
        ],
        responses: {
          "200": {
            description: "Paginated list of blocks",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedBlocksResponse",
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
        summary: "Upsert block (insert or update)",
        operationId: "upsertBlock",
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
        description:
          "Upsert block by ID. If the block with the given ID exists, it will be updated. If it doesn't exist, a new block will be created. The updatedAt field is set automatically by the server and should not be provided in the request.",
        responses: {
          "200": {
            description: "Block upserted successfully",
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
    },
    "/blocks/route/{routeId}": {
      get: {
        tags: ["Blocks"],
        summary: "Get all blocks by route ID",
        operationId: "getBlocksByRouteId",
        parameters: [
          {
            name: "routeId",
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
            description: "List of blocks for the route",
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
    "/edges": {
      post: {
        tags: ["Edges"],
        summary: "Create a new edge",
        operationId: "createEdge",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateEdgeRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Edge created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Edge",
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
    "/edges/{routeId}": {
      get: {
        tags: ["Edges"],
        summary: "Get all edges by route ID",
        operationId: "getEdgesByRouteId",
        parameters: [
          {
            name: "routeId",
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
            description: "List of edges for the route",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/EdgeWithBlocks",
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
    "/edges/{id}": {
      put: {
        tags: ["Edges"],
        summary: "Update edge by ID",
        operationId: "updateEdge",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Edge ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateEdgeRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Edge updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Edge",
                },
              },
            },
          },
          "404": {
            description: "Edge not found",
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
        tags: ["Edges"],
        summary: "Delete edge by ID",
        operationId: "deleteEdge",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Edge ID",
          },
        ],
        responses: {
          "200": {
            description: "Edge deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SuccessMessage",
                },
              },
            },
          },
          "404": {
            description: "Edge not found",
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
        },
        required: [],
        description:
          "The updatedAt field is set automatically by the server and should not be provided in the request.",
      },
      Edge: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the edge",
          },
          from: {
            type: "string",
            description: "Source block ID",
          },
          to: {
            type: "string",
            description: "Target block ID",
          },
          fromHandle: {
            type: "string",
            description: "Source handle identifier",
          },
          toHandle: {
            type: "string",
            description: "Target handle identifier",
          },
        },
        required: ["id", "from", "to"],
      },
      CreateEdgeRequest: {
        type: "object",
        properties: {
          from: {
            type: "string",
            description: "Source block ID",
          },
          to: {
            type: "string",
            description: "Target block ID",
          },
          fromHandle: {
            type: "string",
            description: "Source handle identifier",
          },
          toHandle: {
            type: "string",
            description: "Target handle identifier",
          },
        },
        required: ["from", "to"],
      },
      UpdateEdgeRequest: {
        type: "object",
        properties: {
          from: {
            type: "string",
            description: "Source block ID",
          },
          to: {
            type: "string",
            description: "Target block ID",
          },
          fromHandle: {
            type: "string",
            description: "Source handle identifier",
          },
          toHandle: {
            type: "string",
            description: "Target handle identifier",
          },
        },
        required: [],
      },
      EdgeWithBlocks: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the edge",
          },
          from: {
            type: "string",
            description: "Source block ID",
          },
          to: {
            type: "string",
            description: "Target block ID",
          },
          fromHandle: {
            type: "string",
            description: "Source handle identifier",
          },
          toHandle: {
            type: "string",
            description: "Target handle identifier",
          },
          fromBlock: {
            $ref: "#/components/schemas/Block",
            description: "Source block information",
          },
          toBlock: {
            $ref: "#/components/schemas/Block",
            description: "Target block information",
          },
        },
        required: ["id", "from", "to"],
      },
      PaginatedBlocksResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Block",
            },
            description: "Array of blocks for the current page",
          },
          pagination: {
            type: "object",
            properties: {
              currentPage: {
                type: "integer",
                description: "Current page number",
              },
              totalRecords: {
                type: "integer",
                description: "Total number of blocks",
              },
              hasNextPage: {
                type: "boolean",
                description: "Whether there is a next page available",
              },
            },
            required: ["currentPage", "totalRecords", "hasNextPage"],
          },
        },
        required: ["data", "pagination"],
      },
      BulkOperationRequest: {
        type: "object",
        properties: {
          blocks: {
            type: "array",
            items: {
              $ref: "#/components/schemas/BulkBlockOperation",
            },
            description: "Array of block operations to perform",
          },
          edges: {
            type: "array",
            items: {
              $ref: "#/components/schemas/BulkEdgeOperation",
            },
            description: "Array of edge operations to perform",
          },
        },
        required: ["blocks", "edges"],
      },
      BulkBlockOperation: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["create", "update", "delete"],
            description: "Operation type to perform on the block",
          },
          content: {
            type: "object",
            description:
              "Block data for create/update operations, or block ID for delete operations",
          },
        },
        required: ["action", "content"],
      },
      BulkEdgeOperation: {
        type: "object",
        properties: {
          action: {
            type: "string",
            enum: ["create", "update", "delete"],
            description: "Operation type to perform on the edge",
          },
          content: {
            type: "object",
            description:
              "Edge data for create/update operations, or edge ID for delete operations",
          },
        },
        required: ["action", "content"],
      },
      BulkOperationResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Whether the bulk operation was successful",
          },
          message: {
            type: "string",
            description: "Response message",
          },
        },
        required: ["success", "message"],
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
