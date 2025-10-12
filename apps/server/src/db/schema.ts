import { generateID } from "@cbe/lib";
import {
  boolean,
  index,
  json,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import z from "zod";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const routesEntity = pgTable(
  "routes",
  {
    id: varchar({ length: 50 }).primaryKey().default(generateID()),
    name: varchar({ length: 50 }),
    path: text(),
    method: varchar({ length: 8 }).$type<HttpMethod>(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  () => [index("projectId"), index("path")]
);

export const blocksEntity = pgTable(
  "blocks",
  {
    id: varchar({ length: 50 }).primaryKey().default(generateID()),
    type: varchar({ length: 100 }),
    position: json(),
    data: json(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
    routeId: varchar({ length: 50 }),
  },
  () => [index("routeId")]
);

export const edgesEntity = pgTable(
  "edges",
  {
    id: varchar({ length: 50 }).primaryKey().default(generateID()),
    from: varchar({ length: 50 }).references(() => blocksEntity.id),
    to: varchar({ length: 50 }).references(() => blocksEntity.id),
    fromHandle: varchar({ length: 50 }),
    toHandle: varchar({ length: 50 }),
  },
  () => [index("from"), index("to")]
);

export const encodingTypeEnum = pgEnum("encoding_types", [
  "plaintext",
  "base64",
  "hex",
]);

const encodingTypeValues = z.enum(encodingTypeEnum.enumValues);

export type AppConfigEncodingTypes = z.infer<typeof encodingTypeValues>;

export const appConfigEntity = pgTable("app_config", {
  id: serial().primaryKey(),
  keyName: varchar({ length: 100 }),
  description: text(),
  value: text(),
  isEncrypted: boolean().default(false),
  encoding_type: encodingTypeEnum(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const integrationsEntity = pgTable("integrations", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }),
  group: varchar({ length: 255 }),
  variant: varchar({ length: 255 }),
  config: jsonb(),
});
