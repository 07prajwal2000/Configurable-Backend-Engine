import { ExtractTablesWithRelations } from "drizzle-orm";
import {
  drizzle,
  NodePgDatabase,
  NodePgQueryResultHKT,
} from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

let db: NodePgDatabase = null!;

export async function drizzleInit() {
  const pgUrl = process.env.PG_URL;
  if (!pgUrl) {
    throw new Error("postgres connection url is required for drizzle");
  }
  db = drizzle(pgUrl!);
  const result = await db.execute(`select 1 as connected`);
  if (result.rows[0].connected) {
    console.log("db initialized");
  } else {
    throw new Error("db connection failed");
  }
}

export { db };
export type DbTransactionType = PgTransaction<
  NodePgQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;
