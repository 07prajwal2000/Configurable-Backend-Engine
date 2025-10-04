import { DbType, PostgresAdapter } from "@cbe/adapters/db";
import { JsVM } from "@cbe/lib/vm";

async function main() {
  const pgAdapter = new PostgresAdapter({
    database: "adapter_test",
    dbType: DbType.POSTGRES,
    host: "localhost",
    password: "postgres",
    username: "postgres",
    port: 5432,
    vm: new JsVM({}),
  });
  const users = await pgAdapter.getSingle("users", [
    {
      attribute: "name",
      chain: "and",
      operator: "eq",
      value: "Prajwal Aradhya",
    },
    {
      attribute: "age",
      chain: "or",
      value: 25,
      operator: "eq",
    },
  ]);
  console.log(users);
}

main();
