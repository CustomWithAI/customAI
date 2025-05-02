import { isSameUnorderedArray } from "@/utils/isSameArray";

describe("isSameUnorderedArray", () => {
	it("should return true for identical unordered arrays", () => {
		const array1 = ["apple", "banana", "cherry"];
		const array2 = ["cherry", "banana", "apple"];
		expect(isSameUnorderedArray(array1, array2)).toBe(true);
	});

	it("should return false for arrays with different lengths", () => {
		const array1 = ["apple", "banana", "cherry"];
		const array2 = ["cherry", "banana"];
		expect(isSameUnorderedArray(array1, array2)).toBe(false);
	});

	it("should return false for arrays with different values", () => {
		const array1 = ["apple", "banana", "cherry"];
		const array2 = ["apple", "banana", "date"];
		expect(isSameUnorderedArray(array1, array2)).toBe(false);
	});

	it("should return true for arrays with identical nested objects in different order", () => {
		const array1 = [{ name: "apple" }, { name: "banana" }];
		const array2 = [{ name: "banana" }, { name: "apple" }];
		expect(isSameUnorderedArray(array1, array2)).toBe(true);
	});

	it("should return false for arrays with different nested object values", () => {
		const array1 = [{ name: "apple" }, { name: "banana" }];
		const array2 = [{ name: "banana" }, { name: "cherry" }];
		expect(isSameUnorderedArray(array1, array2)).toBe(false);
	});

	it("should return true for identical unordered arrays of numbers", () => {
		const array1 = [1, 2, 3];
		const array2 = [3, 2, 1];
		expect(isSameUnorderedArray(array1, array2)).toBe(true);
	});

	it("should return false for arrays with mismatched types", () => {
		const array1 = [1, 2, 3];
		const array2 = ["1", "2", "3"] as any;
		expect(isSameUnorderedArray(array1, array2)).toBe(false);
	});

	it("should return false for arrays with mixed types", () => {
		const array1 = [1, "apple", true] as any;
		const array2 = [1, true, "apple"] as any;
		expect(isSameUnorderedArray(array1, array2)).toBe(true);
	});
});
