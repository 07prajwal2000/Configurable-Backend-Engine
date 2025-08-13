import { describe, it, expect, beforeEach, vi } from "vitest";
import { IfBlock, OperatorResult } from "./if";
import { JsVM } from "../vm";

describe("Testing IfBlock", () => {
	describe("Testing evaluateResult()", () => {
		let sut: IfBlock = null!;
		beforeEach(() => {
			sut = new IfBlock({} as any);
		});
		it("should return true when all results are true", () => {
			const results = [
				OperatorResult.TRUE,
				OperatorResult.TRUE,
				OperatorResult.TRUE,
			];
			expect(sut.evaluateResult(results)).toBe(true);
		});
		it("should return true when some results are true with an or operator", () => {
			const results = [
				OperatorResult.TRUE,
				OperatorResult.FALSE,
				OperatorResult.OR,
				OperatorResult.TRUE,
			];
			expect(sut.evaluateResult(results)).toBe(true);
		});
		it("should return false when results are mix of true and false", () => {
			const results = [
				OperatorResult.TRUE,
				OperatorResult.FALSE,
				OperatorResult.OR,
				OperatorResult.FALSE,
			];
			expect(sut.evaluateResult(results)).toBe(false);
		});
		it("should return false when all results are false", () => {
			const results = [OperatorResult.FALSE, OperatorResult.FALSE];
			expect(sut.evaluateResult(results)).toBe(false);
		});
		it("should return true when 1 result is or and other is true", () => {
			const results = [OperatorResult.TRUE, OperatorResult.OR];
			expect(sut.evaluateResult(results)).toBe(true);
		});
		it("should return false when 1 result is or and other is false", () => {
			const results = [OperatorResult.FALSE, OperatorResult.OR];
			expect(sut.evaluateResult(results)).toBe(false);
		});
	});
	describe("Testing evaluateOperator()", () => {
		let sut: IfBlock = null!;
		const context = {
			http: {
				method: "GET",
				pathParams: {
					userId: "123",
				},
			},
			user: {
				roles: ["admin"],
				id: "123",
			},
		};
		const vm = new JsVM(context);
		beforeEach(() => {
			sut = new IfBlock({
				vm,
			});
		});
		it("should return true when operator is eq and lhs and rhs are equal", () => {
			expect(sut.evaluateOperator(1, 1, "eq")).toBe(true);
			expect(sut.evaluateOperator("abc", "abc", "eq")).toBe(true);
			expect(sut.evaluateOperator(true, true, "eq")).toBe(true);
		});
		it("should return true when lhs is gt/gte than rhs and lhs is lt/lte than rhs", () => {
			expect(sut.evaluateOperator(1, 0.9, "gt")).toBe(true);
			expect(sut.evaluateOperator(2, 2, "gte")).toBe(true);

			expect(sut.evaluateOperator(0.9, 1, "lt")).toBe(true);
			expect(sut.evaluateOperator(2, 2, "lte")).toBe(true);
		});
		it("should return false when operator is eq and lhs and rhs are not equal", () => {
			expect(sut.evaluateOperator(1, 2, "neq")).toBe(true);
			expect(sut.evaluateOperator(1, 2, "eq")).toBe(false);
		});
		it("should return success when lhs is js script and rhs is value", () => {
			expect(sut.evaluateOperator("js:1", 1, "gte")).toBe(true);
			expect(sut.evaluateOperator("js:5", 1, "gt")).toBe(true);
			expect(sut.evaluateOperator("js:http.method", "GET", "eq")).toBe(true);
			expect(
				sut.evaluateOperator("js:user.roles.includes('admin')", true, "eq")
			).toBe(true);
			// faliure testing
			expect(sut.evaluateOperator("js:1", 2, "gte")).not.toBe(true);
			expect(sut.evaluateOperator("js:1", 2, "gt")).not.toBe(true);
			expect(sut.evaluateOperator("js:http.method", "POST", "eq")).not.toBe(
				true
			);
		});
		it("should return success when rhs is js script and lhs is value", () => {
			expect(sut.evaluateOperator(1, "js:1", "gte")).toBe(true);
			expect(sut.evaluateOperator(5, "js:2", "gt")).toBe(true);
			expect(sut.evaluateOperator("GET", "js:http.method", "eq")).toBe(true);
			expect(
				sut.evaluateOperator(true, "js:user.roles.includes('admin')", "eq")
			).toBe(true);
		});
		it("should return true when lhs is js script and rhs is js script", () => {
			expect(sut.evaluateOperator("js:1", "js:1", "gte")).toBe(true);
			expect(sut.evaluateOperator("js:5", "js:2", "gt")).toBe(true);
			expect(
				sut.evaluateOperator("js:http.method", "js:http.method", "eq")
			).toBe(true);
		});
	});
});
