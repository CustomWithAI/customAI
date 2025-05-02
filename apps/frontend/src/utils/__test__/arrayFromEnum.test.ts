import type { EnumType } from "@/types/enum";
import { getArrayFromEnum } from "@/utils/array-from-enum";

const mockEnum: EnumType = {
	groupA: {
		type1: ["A", "B", "C"],
		type2: ["D"],
	},
	groupB: {
		type3: ["X", "Y"],
	},
};

describe("getArrayFromEnum", () => {
	it("should return correct array for valid path", () => {
		const result = getArrayFromEnum(mockEnum, ["groupA", "type1"]);
		expect(result).toEqual(["A", "B", "C"]);
	});

	it("should return null for invalid path", () => {
		const result = getArrayFromEnum(mockEnum, ["groupA", "nonexistent"]);
		expect(result).toBeNull();
	});

	it("should return null if path does not resolve to an array", () => {
		const nested: EnumType = {
			root: {
				nested: {
					value: "not-an-array",
				} as any,
			},
		};
		const result = getArrayFromEnum(nested, ["root", "nested", "value"]);
		expect(result).toBeNull();
	});

	it("should return null for undefined enum object", () => {
		const result = getArrayFromEnum(undefined, ["groupA", "type1"]);
		expect(result).toBeNull();
	});

	it("should return null for empty path", () => {
		const result = getArrayFromEnum(mockEnum, []);
		expect(result).toBeNull();
	});

	it("should skip undefined path keys", () => {
		const result = getArrayFromEnum(mockEnum, ["groupA", undefined, "type1"]);
		expect(result).toBeNull();
	});
});
