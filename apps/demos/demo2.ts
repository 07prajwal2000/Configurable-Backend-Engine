import {
	Engine,
	JsRunnerBlock,
	TransformerBlock,
	ConsoleLoggerBlock,
	ForEachLoopBlock,
} from "@cbe/blocks";
import { Context } from "@cbe/blocks/baseBlock";
import { JsVM } from "@cbe/blocks/vm";

const vars = {};
const vm = new JsVM(vars);
const context: Context = {
	apiId: "api_id",
	route: "/api/users",
	vars,
	vm,
};

const jsCode = `
[
{
  username: "prajwal",
  password: "prajwal@1234",
  userage: "25",
},
{
  username: "tony",
  password: "stark@1234",
  userage: "45",
},
{
  username: "bruce",
  password: "wayne@1234",
  userage: "35",
}
]
`;
const childEngine = new Engine({
	transformer: new TransformerBlock(
		context,
		{
			fieldMap: {
				username: "name",
				password: "pass",
				userage: "age",
			},
			useJs: false,
		},
		"logger"
	),
	logger: new ConsoleLoggerBlock(context, {
		level: "info",
	}),
});

const blocks = {
	js: new JsRunnerBlock(context, jsCode, "loop"),
	loop: new ForEachLoopBlock(
		context,
		{
			values: [],
			useParam: true,
			block: "transformer",
		},
		childEngine
	),
};
const engine = new Engine(blocks);
engine.start("js");
