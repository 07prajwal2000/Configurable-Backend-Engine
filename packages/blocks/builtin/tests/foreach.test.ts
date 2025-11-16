import { describe, expect, it, vi } from "vitest";
import { ForEachLoopBlock } from "../loops/foreach";
import { JsVM } from "@fluxify/lib/vm";
import { Engine } from "../../engine";
import { SetVarBlock } from "../setVar";
import { Context } from "../../baseBlock";
import { InterceptorBlock } from "../interceptor";

describe("testing foreach block", () => {
  it("should give each element in array", async () => {
    const vars: Record<string, any> = {};
    const vm = new JsVM(vars);
    const values = ["apple", "banana", "cherry"];
    const context: Context = {
      apiId: "api_id",
      route: "/route",
      vars,
      vm,
    };
    const interceptorFn = vi.fn((context: Context) => {
      expect(context.vars.fruit).toBeDefined();
      expect(values.includes(context.vars.fruit)).toBe(true);
    });
    const engine = new Engine({
      set_var: new SetVarBlock(
        context,
        { key: "fruit", value: "grape" },
        "itc",
        true
      ),
      itc: new InterceptorBlock(context, undefined, interceptorFn),
    });
    const sut = new ForEachLoopBlock(
      context,
      {
        values,
        block: "set_var",
      },
      engine
    );
    const result = await sut.executeAsync();
    expect(result.successful).toBe(true);
    expect(vars["fruit"]).toBeDefined();
    expect(interceptorFn).toHaveBeenCalledTimes(values.length);
  });
});
