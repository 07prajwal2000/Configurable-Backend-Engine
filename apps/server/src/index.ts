import { ConsoleLoggerBlock, Engine, JsRunner } from "@cbe/blocks";
import { Context } from "@cbe/blocks/baseBlock";
import { JsVM } from "@cbe/blocks/vm";

const apiId = "123";
const route = "/users/123";
const vars = {
	apiId,
	route,
	query: {
		id: "123",
		orgId: "456",
	},
}; // this is used as a global variables map for js engine

const context: Context = {
	apiId,
	route,
	vars,
	vm: new JsVM(vars),
};

const blocks = {
	js1: new JsRunner(context, `query.id;`, "js2"),
	js2: new JsRunner(context, `input + " " + query.id;`, "cli"),
	cli: new ConsoleLoggerBlock(context),
};

const engine = new Engine(blocks);
engine.start("js1");
