import { Knex } from "knex";
import { DbAdapterMode, DBConditionType, IDbAdapter } from ".";
import { JsVM } from "@cbe/lib/vm";

export class PostgresAdapter implements IDbAdapter {
  private mode: DbAdapterMode = DbAdapterMode.NORMAL;
  private transaction: Knex.Transaction | null = null;
  private readonly HARD_LIMIT = 1000;

  constructor(private readonly connection: Knex, private readonly vm: JsVM) {}
  async raw(query: string | unknown): Promise<any> {
    if (typeof query !== "string")
      throw new Error("raw function accepts only string queries.");
    const conn = this.getConnection()!;
    return await conn.raw(query);
  }
  async getAll(
    table: string,
    conditions: DBConditionType[],
    limit: number = this.HARD_LIMIT
  ): Promise<unknown[]> {
    const conn = this.getConnection()!;
    let queryBuilder = conn(table);
    queryBuilder = this.buildQuery(conditions, queryBuilder);
    const l = limit < 0 || limit > this.HARD_LIMIT ? this.HARD_LIMIT : limit!;
    const data = await queryBuilder.limit(l).select("*");
    return data;
  }
  async getSingle(
    table: string,
    conditions: DBConditionType[]
  ): Promise<unknown | null> {
    const conn = this.getConnection()!;
    let queryBuilder = conn(table);
    queryBuilder = this.buildQuery(conditions, queryBuilder);
    return await queryBuilder.first("*");
  }
  async delete(table: string, conditions: DBConditionType[]): Promise<boolean> {
    const conn = this.getConnection()!;
    let queryBuilder = conn(table);
    queryBuilder = this.buildQuery(conditions, queryBuilder);
    const result = await queryBuilder.limit(1).delete();
    return result > 0;
  }
  async insert(table: string, data: unknown): Promise<void> {
    const conn = this.getConnection()!;
    await conn(table).insert(data);
  }
  async insertBulk(table: string, data: any[]): Promise<void> {
    const conn = this.getConnection()!;
    await conn.batchInsert(table, data);
  }
  async update(
    table: string,
    data: unknown,
    conditions: DBConditionType[]
  ): Promise<void> {
    const conn = this.getConnection()!;
    let queryBuilder = conn(table);
    queryBuilder = this.buildQuery(conditions, queryBuilder);
    await queryBuilder.update(data);
  }
  setMode(mode: DbAdapterMode): void {
    if (mode == DbAdapterMode.TRANSACTION) {
      // @ts-ignore
      this.transaction = this.connection.transaction();
    } else {
      this.transaction = null;
    }
    this.mode = mode;
  }
  async commitTransaction() {
    if (this.mode !== DbAdapterMode.TRANSACTION)
      throw new Error("db adapter is not in transaction mode");
    await this.transaction?.commit();
    this.setMode(DbAdapterMode.NORMAL);
  }
  async rollbackTransaction() {
    if (this.mode !== DbAdapterMode.TRANSACTION)
      throw new Error("db adapter is not in transaction mode");
    await this.transaction?.rollback();
    this.setMode(DbAdapterMode.NORMAL);
  }
  private buildQuery(
    conditions: DBConditionType[],
    builder: Knex.QueryBuilder
  ) {
    for (let condition of conditions) {
      const operator = this.getNativeOperator(condition.operator);
      const value =
        typeof condition.value === "string" && condition.value.startsWith("js:")
          ? this.vm.run(condition.value.slice(3))
          : condition.value;

      if (condition.chain == "or") {
        builder = builder.orWhere(condition.attribute, operator, value);
      } else {
        builder = builder.andWhere(condition.attribute, operator, value);
      }
    }
    return builder;
  }
  private getNativeOperator(
    operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte"
  ) {
    if (operator == "eq") return "=";
    else if (operator == "neq") return "<>";
    else if (operator == "gt") return ">";
    else if (operator == "gte") return ">=";
    else if (operator == "lt") return "<";
    else if (operator == "lte") return "<=";
    else return "=";
  }
  private getConnection() {
    if (this.mode === DbAdapterMode.TRANSACTION) {
      return this.transaction;
    }
    return this.connection;
  }
}
