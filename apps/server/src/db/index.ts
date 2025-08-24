import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

let db: NodePgDatabase;

export function drizzleInit() {
  const pgUrl = process.env.PG_URL;
  if (!pgUrl) {
    throw new Error("postgres connection url is required for drizzle");
  }
  db = drizzle(pgUrl!);
}
