import { operatorSchema } from "@cbe/lib";
import z from "zod";
import { Connection, DbType } from "./connection";
import { PostgresAdapter } from "./postgresAdapter";

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
  constructor(private readonly connection: Connection) {}

  public create(): IDbAdapter {
    if (this.connection.dbType === DbType.POSTGRES) {
      return new PostgresAdapter(this.connection);
    }
    throw new Error("MongoDB Not implemented");
  }
}

export * from "./postgresAdapter";
export * from "./connection";
