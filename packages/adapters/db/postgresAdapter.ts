import knex, { Knex } from "knex";
import { DBConditionType, IDbAdapter } from ".";
import { Connection } from "./connection";

export class PostgresAdapter implements IDbAdapter {
  private readonly knex: Knex = null!;

  constructor(connection: Connection) {
    this.knex = knex({
      client: "pg",
      connection: {
        host: connection.host,
        port: Number(connection.port),
        user: connection.username,
        password: connection.password,
        database: connection.database,
      },
    });
  }
  getAll(conditions: DBConditionType[], limit?: number): unknown[] {
    throw new Error("Method not implemented.");
  }
  getByAttribute(attr: string, value: string): unknown | null {
    throw new Error("Method not implemented.");
  }
  deleteByAttribute(attr: string, value: string): boolean {
    throw new Error("Method not implemented.");
  }
  insert(table: string, data: unknown): void {
    throw new Error("Method not implemented.");
  }
  insertBulk(table: string, data: unknown[]): void {
    throw new Error("Method not implemented.");
  }
  update(table: string, data: unknown, conditions: DBConditionType[]): void {
    throw new Error("Method not implemented.");
  }
  deleteRange(conditions: DBConditionType[]): boolean {
    throw new Error("Method not implemented.");
  }
}
