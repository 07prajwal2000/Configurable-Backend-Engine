export enum BlockTypes {
  entrypoint = "entrypoint",
  httprequest = "httprequest",
  if = "if",
  httpgetheader = "httpgetheader",
  httpsetheader = "httpsetheader",
  httpgetparam = "httpgetparam",
  httpgetcookie = "httpgetcookie",
  httpsetcookie = "httpsetcookie",
  httpgetrequestbody = "httpgetrequestbody",
  forloop = "forloop",
  foreachloop = "foreachloop",
  transformer = "transformer",
  setvar = "setvar",
  getvar = "getvar",
  consolelog = "consolelog",
  jsrunner = "jsrunner",
  response = "response",
  arrayops = "arrayops",
  db_getsingle = "db_getsingle",
  db_getall = "db_getall",
  db_delete = "db_delete",
  db_insert = "db_insert",
  db_insertbulk = "db_insertbulk",
  db_update = "db_update",
  db_native = "db_native",
  db_transaction = "db_transaction",
}
export type BaseBlockType = {
  id: string;
  type: BlockTypes;
  position: {
    x: number;
    y: number;
  };
  data: any;
};

export type EdgeType = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
};

export type EditorActionStateType =
  | ({
      variant: "block";
      actionType: "add" | "edit" | "delete";
    } & BaseBlockType)
  | ({
      variant: "edge";
      actionType: "add" | "delete";
    } & EdgeType);
