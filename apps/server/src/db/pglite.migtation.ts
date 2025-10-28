import { pushSchema } from "drizzle-kit/api";
import "dotenv/config";
import { drizzle } from "drizzle-orm/pglite";
import * as schemas from "./schema";
import { sql } from "drizzle-orm";

const dbVariant = process.env.DB_VARIANT;

if (dbVariant !== "pglite") {
  console.log("db variant is not pglite, skipping migration");
  process.exit(0);
}

const pglitePath = process.env.DB_PGLITE_PATH as string;

if (!pglitePath) {
  console.log("pglite path is not set, skipping migration");
  process.exit(0);
}

async function main() {
  const db = drizzle(pglitePath);
  const { apply } = await pushSchema(schemas, db);
  await apply();
  console.log("db migrated");
}

main();
