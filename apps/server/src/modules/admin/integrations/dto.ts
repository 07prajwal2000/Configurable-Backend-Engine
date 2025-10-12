import z from "zod";

export const integrationsGroupSchema = z.enum(["database", "kv"]); // TODO: more coming soon

export const databaseVariantSchema = z.enum(["PostgreSQL", "MongoDB"]);
export const kvVariantSchema = z.enum(["Redis", "Memcached"]);

export const postgresVariantConfigSchema = z.object({
  name: z.string(),
  dbType: z.string().refine((v) => v === databaseVariantSchema.enum.PostgreSQL),
  username: z.string(),
  password: z.string(),
  host: z.string(),
  port: z.string().or(z.number()),
  database: z.string(),
});

export const mongodbVariantConfigSchema = postgresVariantConfigSchema.extend({
  dbType: z.string().refine((v) => v === databaseVariantSchema.enum.MongoDB),
});

export const redisVariantSchema = postgresVariantConfigSchema
  .pick({
    name: true,
    host: true,
    port: true,
    username: true,
    password: true,
  })
  .extend({
    dbType: z.string().refine((v) => v === kvVariantSchema.enum.Redis),
  });

export const memcachedVariantSchema = redisVariantSchema.extend({
  dbType: z.string().refine((v) => v === kvVariantSchema.enum.Memcached),
});

export const groupSchemaMap = {
  [integrationsGroupSchema.enum.database]: {
    [databaseVariantSchema.enum.PostgreSQL]: postgresVariantConfigSchema,
    [databaseVariantSchema.enum.MongoDB]: mongodbVariantConfigSchema,
  },
  [integrationsGroupSchema.enum.kv]: {
    [kvVariantSchema.enum.Redis]: redisVariantSchema,
    [kvVariantSchema.enum.Memcached]: memcachedVariantSchema,
  },
};

export const getVariantSchema = z.object({
  group: integrationsGroupSchema,
  variant: z.string().refine((val) => {
    return (
      databaseVariantSchema.safeParse(val).success ||
      kvVariantSchema.safeParse(val).success
    );
  }),
});
export const updateVariantSchema = z.object({
  group: integrationsGroupSchema,
  variant: z.string().refine((val) => {
    return (
      databaseVariantSchema.safeParse(val).success ||
      kvVariantSchema.safeParse(val).success
    );
  }),
  id: z.uuidv7(),
});
