import { operatorSchema } from "@cbe/lib";
import z from "zod";
import { Connection, DbType } from "./connection";
import { PostgresAdapter } from "./postgresAdapter";
import knex, { Knex } from "knex";
import { JsVM } from "@cbe/lib/vm";

export const whereConditionSchema = z.object({
  attribute: z.string(),
  operator: operatorSchema.exclude(["js"]),
  value: z.string().or(z.number()),
  chain: z.enum(["and", "or"]),
});

export type DBConditionType = z.infer<typeof whereConditionSchema>;

export enum DbAdapterMode {
  NORMAL = 1,
  TRANSACTION = 2,
}

export interface IDbAdapter {
  getAll(
    table: string,
    conditions: DBConditionType[],
    limit: number
  ): Promise<unknown[]>;
  getSingle(
    table: string,
    conditions: DBConditionType[]
  ): Promise<unknown | null>;
  insert(table: string, data: unknown): Promise<void>;
  insertBulk(table: string, data: unknown[]): Promise<void>;
  update(
    table: string,
    data: unknown,
    conditions: DBConditionType[]
  ): Promise<void>;
  raw(query: string | unknown): Promise<any>;
  delete(table: string, conditions: DBConditionType[]): Promise<boolean>;
  setMode(mode: DbAdapterMode): void;
  commitTransaction(): void;
  rollbackTransaction(): void;
}

export class DbFactory {
  private readonly connectionMap: Record<string, IDbAdapter> = {};
  constructor(
    private readonly vm: JsVM,
    private readonly dbConfig: Record<string, Connection>
  ) {}

  public getDbAdapter(connection: string): IDbAdapter {
    const cfg = this.dbConfig[connection];
    if (!cfg) {
      throw new Error("config is null while creating db adapter");
    }
    if (connection in this.connectionMap) return this.connectionMap[connection];
    if (cfg.dbType === DbType.POSTGRES) {
      return (this.connectionMap[connection] = new PostgresAdapter(
        this.getKnexConnection(cfg),
        this.vm
      ));
    }
    throw new Error("MongoDB Not implemented");
  }

  private static knexConnection: Knex = null!;
  private getKnexConnection(cfg: Connection) {
    if (DbFactory.knexConnection === null) {
      DbFactory.knexConnection = knex({
        client: "pg",
        connection: {
          host: cfg.host,
          port: Number(cfg.port),
          userName: cfg.username,
          password: cfg.password,
          database: cfg.database,
        },
      });
    }
    return DbFactory.knexConnection;
  }
}

export * from "./postgresAdapter";
export * from "./connection";
// this.connection = knex({
//   client: "pg",
//   connection: {
//     host: connection.host,
//     port: Number(connection.port),
//     user: connection.username,
//     password: connection.password,
//     database: connection.database,
//   },
// });
