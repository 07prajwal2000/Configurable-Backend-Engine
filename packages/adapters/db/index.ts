import { operatorSchema } from "@cbe/lib";
import z from "zod";
import { Connection, DbType } from "./connection";
import { PostgresAdapter } from "./PostgresAdapter";

const whereCondition = z.object({
  attribute: z.string(),
  operator: operatorSchema.exclude(["js"]),
  value: z.string(),
  chain: z.enum(["and", "or"]),
});

export type DBConditionType = z.infer<typeof whereCondition>;

export interface IDbAdapter {
  getAll(conditions: DBConditionType[], limit?: number): unknown[];
  getByAttribute(attr: string, value: string): unknown | null;
  deleteByAttribute(attr: string, value: string): boolean;
  insert(table: string, data: unknown): void;
  insertBulk(table: string, data: unknown[]): void;
  update(table: string, data: unknown, conditions: DBConditionType[]): void;
  deleteRange(conditions: DBConditionType[]): boolean;
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
