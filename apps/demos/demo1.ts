import {
	Engine,
	JsRunnerBlock,
	TransformerBlock,
	ConsoleLoggerBlock,
	ForEachLoopBlock,
	ForLoopBlock,
} from "@fluxify/blocks";
import { Context } from "@fluxify/blocks/baseBlock";
import { JsVM } from "@fluxify/blocks/vm";

const vars = {};
const vm = new JsVM(vars);
const context: Context = {
	apiId: "api_id",
	route: "/api/users",
	vars,
	vm,
};

const jsCode = `
const users = [
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
	js: new JsRunnerBlock(context, `users[input]`, "transformer"),
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
	js: new JsRunnerBlock(context, jsCode, "forloop"),
	forloop: new ForLoopBlock(
		context,
		{
			start: 0,
			end: 3,
			step: 1,
			block: "js",
		},
		childEngine
	),
};
const engine = new Engine(blocks);
engine.start("js");
