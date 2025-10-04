import { JsVM } from "@cbe/lib/vm";

export enum DbType {
  POSTGRES = "pg",
  MONGODB = "mongo",
}

export interface Connection {
  dbType: DbType;
  username: string;
  password: string;
  host: string;
  port: string | number;
  database: string;
  vm: JsVM;
}
