import { generateID } from "@cbe/lib";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const routesEntity = pgTable("routes", {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }),
});

export const blocksEntity = pgTable("blocks", {
  id: varchar({ length: 50 }).primaryKey().default(generateID()),
});
