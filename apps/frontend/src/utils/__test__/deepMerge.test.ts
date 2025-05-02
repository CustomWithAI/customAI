import type { Metadata } from "@/stores/dragStore";
import { deepMerge } from "@/utils/deepMerge";

describe("deepMerge", () => {
	it("should merge non-conflicting entries", () => {
		const a: Metadata = {
			name: { type: "String", value: "Alice" },
		};
		const b: Metadata = {
			age: { type: "Number", value: 30 },
		};
		const result = deepMerge(a, b);
		expect(result).toEqual({
			name: { type: "String", value: "Alice" },
			age: { type: "Number", value: 30 },
		});
	});

	it("should warn and skip entries with missing type", () => {
		const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
		const a: Metadata = {};
		const b: Metadata = {
			broken: { value: "oops" } as any,
		};
		const result = deepMerge(a, b);
		expect(result).toEqual({});
		expect(warn).toHaveBeenCalledWith(`Missing 'type' for key "broken"`);
		warn.mockRestore();
	});

	it("should warn and skip type mismatch entries", () => {
		const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
		const a: Metadata = {
			name: { type: "String", value: "Alice" },
		};
		const b: Metadata = {
			name: { type: "Number", value: 123 },
		};
		const result = deepMerge(a, b);
		expect(result).toEqual(a);
		expect(warn).toHaveBeenCalledWith(
			`Type mismatch for key "name": expected String, got Number`,
		);
		warn.mockRestore();
	});

	it("should merge nested Object values recursively", () => {
		const a: Metadata = {
			config: {
				type: "Object",
				value: {
					theme: { type: "String", value: "light" },
				},
			},
		};
		const b: Metadata = {
			config: {
				type: "Object",
				value: {
					layout: { type: "String", value: "grid" },
				},
			},
		};
		const result = deepMerge(a, b);
		expect(result).toEqual({
			config: {
				type: "Object",
				value: {
					theme: { type: "String", value: "light" },
					layout: { type: "String", value: "grid" },
				},
			},
		});
	});

	it("should override existing entry with compatible type", () => {
		const a: Metadata = {
			name: { type: "String", value: "Alice" },
		};
		const b: Metadata = {
			name: { type: "String", value: "Bob" },
		};
		const result = deepMerge(a, b);
		expect(result).toEqual({
			name: { type: "String", value: "Bob" },
		});
	});
});
