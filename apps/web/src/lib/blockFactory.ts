import { BlockTypes } from "@/types/block";
import { stickyNotesSchema } from "@cbe/blocks";
import z from "zod";

export function createBlockData(block: BlockTypes) {
  switch (block) {
    case BlockTypes.httprequest:
      return {
        url: "",
        method: "GET",
        headers: {},
        body: {},
        useParam: false,
      };
    case BlockTypes.if:
      return {
        conditions: [],
      };
    case BlockTypes.httpgetheader:
      return { name: "" };
    case BlockTypes.httpsetheader:
      return {
        name: "",
        value: "",
      };
    case BlockTypes.httpgetparam:
      return {
        name: "",
        source: "query",
      };
    case BlockTypes.httpgetcookie:
      return { name: "" };
    case BlockTypes.httpsetcookie:
      return {
        name: "",
        value: "",
        domain: "",
        path: "",
        expiry: new Date(),
        httpOnly: true,
        secure: true,
        samesite: "Strict",
      };
    case BlockTypes.httpgetrequestbody:
      return {};
    case BlockTypes.forloop:
      return {
        block: "",
        start: 0,
        end: 10,
        step: 1,
      };
    case BlockTypes.foreachloop:
      return {
        block: "",
        values: [],
        useParam: false,
      };
    case BlockTypes.transformer:
      return {
        fieldMap: {},
        js: "",
        useJs: false,
      };
    case BlockTypes.setvar:
      return {
        key: "",
        value: "",
      };
    case BlockTypes.getvar:
      return { key: "" };
    case BlockTypes.consolelog:
      return {
        message: "",
        level: "info",
      };
    case BlockTypes.jsrunner:
      return {
        value: "",
      };
    case BlockTypes.response:
      return { httpCode: "200" };
    case BlockTypes.arrayops:
      return {
        operation: "push",
        value: "",
        useParamAsInput: false,
        datasource: "",
      };
    case BlockTypes.db_getsingle:
      return {
        connection: "",
        tableName: "",
        conditions: [],
      };
    case BlockTypes.db_getall:
      return {
        connection: "",
        tableName: "",
        conditions: [],
        limit: 10,
      };
    case BlockTypes.db_delete:
      return {
        connection: "",
        tableName: "",
        conditions: [],
      };
    case BlockTypes.db_insert:
      return {
        connection: "",
        tableName: "",
        data: {},
        useParam: false,
      };
    case BlockTypes.db_insertbulk:
      return {
        connection: "",
        tableName: "",
        data: [],
        useParam: false,
      };
    case BlockTypes.db_update:
      return {
        connection: "",
        tableName: "",
        data: {},
        conditions: [],
        useParam: false,
      };
    case BlockTypes.db_native:
      return {
        js: "",
        connection: "",
      };
    case BlockTypes.db_transaction:
      return {
        connection: "",
        executor: "",
      };
    case BlockTypes.stickynote:
      return {
        notes: "",
        color: "yellow",
        size: {
          width: 100,
          height: 100,
        },
      } as z.infer<typeof stickyNotesSchema>;
    default:
      return {};
  }
}
