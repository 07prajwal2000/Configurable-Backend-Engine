import {
	ConsoleLoggerBlock,
	Engine,
	IfBlock,
	JsRunnerBlock,
	SetVarBlock,
} from "@cbe/blocks";
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
	js1: new JsRunnerBlock(context, `query.id;`, "if1"),
	if1: new IfBlock("js2", "cl2", context, {
		conditions: [
			{
				chain: "and",
				lhs: 123,
				rhs: 123,
				operator: "eq",
			},
		],
	}),
	js2: new JsRunnerBlock(
		context,
		`
		const uid = "UID:1234";
		input.toString() + " " + query.id;
	`,
		"svar1"
	),
	svar1: new SetVarBlock(
		context,
		{
			key: "cache_key",
			value: "js:'KEY:' + query.orgId + ':' + query.id",
		},
		"js3"
	),
	js3: new JsRunnerBlock(context, `cache_key;`, "cli"),
	cli: new ConsoleLoggerBlock(context, { level: "info" }),
	cli2: new ConsoleLoggerBlock(context, { level: "info" }),
};

const engine = new Engine(blocks);
engine.start("js1");
