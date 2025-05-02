import { defineString } from "@/utils/define"; // adjust path as needed

describe("defineString", () => {
	it("should return a number if the string is numeric", () => {
		expect(defineString("42")).toBe(42);
		expect(defineString("3.14")).toBe(3.14);
		expect(defineString("-10")).toBe(-10);
	});

	it("should return true if the string is 'true' (case-insensitive)", () => {
		expect(defineString("true")).toBe(true);
		expect(defineString("TRUE")).toBe(true);
		expect(defineString("TrUe")).toBe(true);
	});

	it("should return false if the string is 'false' (case-insensitive)", () => {
		expect(defineString("false")).toBe(false);
		expect(defineString("FALSE")).toBe(false);
		expect(defineString("FaLsE")).toBe(false);
	});

	it("should return the original string if not a number or boolean", () => {
		expect(defineString("hello")).toBe("hello");
		expect(defineString("null")).toBe("null");
		expect(defineString("yes")).toBe("yes");
	});

	it("should return 0 if the input is '0'", () => {
		expect(defineString("0")).toBe(0);
	});

	it("should return NaN-like strings as strings", () => {
		expect(defineString("123abc")).toBe("123abc");
	});
});
