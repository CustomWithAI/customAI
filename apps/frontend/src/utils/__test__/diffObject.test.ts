import { type DiffResult, diffObjects } from "@/utils/diffVersion";

describe("diffObjects", () => {
	it("should detect changes in primitive fields", () => {
		const oldObj = { name: "Alice", age: 30 };
		const newObj = { name: "Bob", age: 30 };

		const result = diffObjects(oldObj, newObj, ["name", "age"]);
		expect(result).toEqual([{ title: "name", old: "Alice", new: "Bob" }]);
	});

	it("should detect added keys when oldObj is undefined", () => {
		const newObj = { name: "Alice", age: 25 };
		const result = diffObjects(undefined, newObj, ["name", "age"]);
		expect(result).toEqual([
			{ title: "name", old: "-", new: "Alice" },
			{ title: "age", old: "-", new: "25" },
		]);
	});

	it("should skip unchanged keys", () => {
		const oldObj = { name: "Alice" };
		const newObj = { name: "Alice" };

		const result = diffObjects(oldObj, newObj, ["name"]);
		expect(result).toEqual([]);
	});

	it("should detect differences in nested objects", () => {
		const oldObj = { config: { theme: "light", layout: "grid" } };
		const newObj = { config: { theme: "dark", layout: "grid" } };

		const result = diffObjects(oldObj, newObj, ["config"]);
		expect(result).toEqual([
			{ title: "config theme", old: "light", new: "dark" },
		]);
	});

	it("should ignore excluded sub-keys", () => {
		const oldObj = { config: { theme: "light", layout: "grid" } };
		const newObj = { config: { theme: "dark", layout: "list" } };

		const result = diffObjects(oldObj, newObj, ["config"], ["layout"]);
		expect(result).toEqual([
			{ title: "config theme", old: "light", new: "dark" },
		]);
	});

	it("should detect differences in arrays", () => {
		const oldObj = { list: [1, 2, 3] };
		const newObj = { list: [1, 2, 4] };

		const result = diffObjects(oldObj, newObj, ["list"]);
		expect(result).toEqual([{ title: "list", old: "[1,2,3]", new: "[1,2,4]" }]);
	});

	it("should compare nulls and undefined as `-`", () => {
		const oldObj = { value: null } as any;
		const newObj = { value: "123" };

		const result = diffObjects(oldObj, newObj, ["value"]);
		expect(result).toEqual([{ title: "value", old: "-", new: "123" }]);
	});

	it("should serialize objects correctly", () => {
		const oldObj = { meta: { a: 1 } };
		const newObj = { meta: { a: 2 } };

		const result = diffObjects(oldObj, newObj, ["meta"]);
		expect(result).toEqual([{ title: "meta a", old: "1", new: "2" }]);
	});
});
