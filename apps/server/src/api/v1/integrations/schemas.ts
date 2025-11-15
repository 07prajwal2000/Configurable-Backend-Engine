import z, { ZodType } from "zod";
import { parsePostgresUrl } from "../../../lib/parsers/postgres";

// ALWAYS MAKE SURE THE SCHEMA IS FLAT
export const integrationsGroupSchema = z.enum(["database", "kv", "ai", "baas"]);

export const databaseVariantSchema = z.enum(["PostgreSQL", "MongoDB", "MySQL"]);
export const kvVariantSchema = z.enum(["Redis", "Memcached"]);
export const aiVariantSchema = z.enum([
  "OpenAI",
  "Anthropic",
  "OpenAI Compatible",
]);
export const baasVariantSchema = z.enum(["Firebase", "Supabase"]);

// Database
export const postgresVariantConfigSchema = z
  .object({
    dbType: z
      .string()
      .refine((v) => v === databaseVariantSchema.enum.PostgreSQL),
    username: z.string().min(1),
    password: z.string().min(1),
    host: z.string().min(1),
    port: z.string().or(z.number()),
    database: z.string().min(1),
    useSSL: z.boolean().default(false).optional(),
  })
  .or(
    z.object({
      url: z
        .string()
        .min(10)
        .refine((v) => {
          if (v.startsWith("cfg:")) {
            return true;
          }
          const result = parsePostgresUrl(v);
          return result !== null;
        }),
    })
  );

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
