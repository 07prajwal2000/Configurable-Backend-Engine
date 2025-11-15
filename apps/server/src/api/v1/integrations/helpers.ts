import z, { ZodType } from "zod";
import {
  integrationsGroupSchema,
  databaseVariantSchema,
  postgresVariantConfigSchema,
  kvVariantSchema,
} from "./schemas";

type Variants = keyof typeof databaseVariantSchema.enum;

export function getIntegrationsGroups() {
  return Object.values(integrationsGroupSchema.options);
}

export function getIntegrationsVariants(
  group: z.infer<typeof integrationsGroupSchema>
) {
  if (group === "database") {
    return Object.values(databaseVariantSchema.options);
  }
  return [];
}

export function getDefaultVariantValue(variant: Variants) {
  if (variant === "PostgreSQL") {
    return {
      host: "",
      port: 0,
      database: "",
      username: "",
      password: "",
      dbType: databaseVariantSchema.enum.PostgreSQL,
      url: "",
      useSSL: false,
      source: "credentials",
    } as z.infer<typeof postgresVariantConfigSchema>;
  }
  return null;
}

export function getSchema(
  group: z.infer<typeof integrationsGroupSchema>,
  variant: string
) {
  let schema: ZodType = null!;
  if (group === "database") {
    const result = databaseVariantSchema.safeParse(variant);
    if (!result.success) {
      return null;
    }
    switch (variant as z.infer<typeof databaseVariantSchema>) {
      case "PostgreSQL":
        schema = postgresVariantConfigSchema;
        break;
      default:
        return null;
    }
  } else if (group === "kv") {
    const result = kvVariantSchema.safeParse(variant);
    if (!result.success) {
      return null;
    }
    switch (variant as z.infer<typeof kvVariantSchema>) {
      default:
        return null;
    }
  }
  return schema;
}
