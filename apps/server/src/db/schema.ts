import { generateID } from "@cbe/lib";
import {
  index,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

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
    routeId: varchar({ length: 50 }).references(() => routesEntity.id),
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
