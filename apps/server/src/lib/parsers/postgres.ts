import { Connection, DbType } from "@cbe/adapters/db";

export function parsePostgresUrl(url: string): Connection | null {
  // Regex to match: postgres://Username:Password@Host:Port/DB_NAME?ssl=boolean
  const regex =
    /^postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)\?ssl=(true|false|1|0)$/i;
  const match = url.match(regex);

  if (!match) {
    return null;
  }

  const [, username, password, host, portStr, database, sslStr] = match;

  const port = parseInt(portStr, 10);
  const ssl = sslStr === "true" || sslStr === "1";

  return {
    username,
    password,
    host,
    port,
    database,
    ssl,
    dbType: DbType.POSTGRES,
  };
}
