import { z } from "zod";
import { encodingTypeEnum, AppConfigEncodingTypes } from "../../../db/schema";

// Database response schema (handles nullable fields from DB)
export const appConfigDbSchema = z.object({
  id: z.number(),
  keyName: z.string().nullable(),
  description: z.string().nullable(),
  value: z.string().nullable(),
  isEncrypted: z.boolean().nullable(),
  encoding_type: z.enum(["plaintext", "base64", "hex"]).nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

// Base app config schema (for input/validation)
export const appConfigSchema = z.object({
  id: z.number().optional(),
  keyName: z
    .string()
    .min(1, "Key name is required")
    .max(100, "Key name too long"),
  description: z.string().optional(),
  value: z.string().min(1, "Value is required"),
  isEncrypted: z.boolean().default(false),
  encoding_type: z.enum(["plaintext", "base64", "hex"]).default("plaintext"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Define the type for appConfigEntity
export type AppConfigType = z.infer<typeof appConfigSchema>;

// Define specific schemas for each operation
export const createAppConfigSchema = appConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAppConfigSchema = appConfigSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const getAppConfigByIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a valid number")
    .transform((val) => parseInt(val, 10)),
});

export const getAppConfigByKeySchema = z.object({
  keyName: z.string().min(1, "Key name is required"),
});

// Pagination schema
export const paginationSchema = z
  .object({
    page: z
      .string()
      .regex(/^\d+$/)
      .transform((val) => parseInt(val, 10))
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform((val) => parseInt(val, 10))
      .optional(),
    search: z.string().optional(),
    sortBy: z.enum(["keyName", "createdAt", "updatedAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
  .transform((data) => ({
    page: data.page ?? 1,
    limit: data.limit ?? 10,
    search: data.search,
    sortBy: data.sortBy ?? "createdAt",
    sortOrder: data.sortOrder ?? "desc",
  }));

// Response schemas
export const appConfigResponseSchema = appConfigSchema.extend({
  maskedValue: z.string().optional(),
  displayValue: z.string().optional(),
});

export type AppConfigResponse = z.infer<typeof appConfigResponseSchema>;
export type CreateAppConfigInput = z.infer<typeof createAppConfigSchema>;
export type UpdateAppConfigInput = z.infer<typeof updateAppConfigSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

// Bulk operation schemas
export const bulkAppConfigOperationSchema = z.object({
  action: z.enum(["create", "update", "delete"]),
  data: z.any(), // App config data
});

export const bulkAppConfigOperationArraySchema = z.array(
  bulkAppConfigOperationSchema
);

export type BulkAppConfigOperation = z.infer<
  typeof bulkAppConfigOperationSchema
>;
export type BulkAppConfigOperations = z.infer<
  typeof bulkAppConfigOperationArraySchema
>;

// Validation schemas for different encoding types
export const validateEncodingValueSchema = z.object({
  value: z.string().min(1, "Value is required"),
  encoding_type: encodingTypeEnum(),
});
