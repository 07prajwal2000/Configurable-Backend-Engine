import { generateID } from "@cbe/lib";
import { sql } from "drizzle-orm";
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

export const projectsEntity = pgTable(
  "projects",
  {
    id: varchar({ length: 50 }).primaryKey().default(generateID()),
    name: varchar({ length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    hidden: boolean().default(false),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  () => [index("name"), index("updated_at")]
);

export const routesEntity = pgTable(
  "routes",
  {
    id: varchar({ length: 50 }).primaryKey().default(generateID()),
    name: varchar({ length: 50 }),
    path: text(),
    active: boolean().default(false),
    projectId: varchar("project_id", { length: 50 })
      .references(() => projectsEntity.id, {
        onDelete: "cascade",
      })
      .default(sql`NULL`),
    method: varchar({ length: 8 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: varchar("created_by", { length: 50 }),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  () => [index("project_id"), index("path")]
);

export const blocksEntity = pgTable(
  "blocks",
  {
    id: varchar({ length: 50 }).primaryKey().default(generateID()),
    type: varchar({ length: 100 }),
    position: json(),
    data: json(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    routeId: varchar("route_id", { length: 50 }).references(
      () => routesEntity.id,
      {
        onDelete: "cascade",
      }
    ),
  },
  () => [index("route_id")]
);

export const edgesEntity = pgTable(
  "edges",
  {
    id: varchar({ length: 50 }).primaryKey().default(generateID()),
    from: varchar({ length: 50 }).references(() => blocksEntity.id, {
      onDelete: "cascade",
    }),
    to: varchar({ length: 50 }).references(() => blocksEntity.id, {
      onDelete: "cascade",
    }),
    fromHandle: varchar("from_handle", { length: 50 }),
    toHandle: varchar("to_handle", { length: 50 }),
    routeId: varchar("route_id", { length: 50 }).references(
      () => routesEntity.id,
      {
        onDelete: "cascade",
      }
    ),
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
  keyName: varchar("key_name", { length: 100 }),
  description: text(),
  value: text(),
  isEncrypted: boolean("is_encrypted").default(false),
  encoding_type: encodingTypeEnum(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const integrationsEntity = pgTable("integrations", {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }),
  group: varchar({ length: 255 }),
  variant: varchar({ length: 255 }),
  config: jsonb(),
});
