import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

let db: NodePgDatabase;

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
