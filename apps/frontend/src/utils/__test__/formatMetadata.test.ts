import type { Metadata } from "@/stores/dragStore";
import {
	arrayToMetadata,
	formatMetadata,
	metadataToArray,
	metadataToJSON,
} from "../formatMetadata";

describe("formatMetadata", () => {
	it("formats simple metadata", () => {
		const metadata: Metadata = {
			enabled: { type: "Boolean", value: true },
			name: { type: "String", value: "test" },
			count: { type: "Number", value: 5 },
		};
		expect(formatMetadata(metadata)).toBe("enabled:true, name:test, count:5");
	});

	it("formats nested object metadata", () => {
		const metadata: Metadata = {
			size: {
				type: "Object",
				value: {
					width: { type: "Number", value: 100 },
					height: { type: "Number", value: 200 },
				},
			},
		};
		expect(formatMetadata(metadata)).toBe("size: [width:100, height:200]");
	});

	it("formats object with x and y as px", () => {
		const metadata: Metadata = {
			position: {
				type: "Object",
				value: {
					x: { type: "Number", value: 10 },
					y: { type: "Number", value: 20 },
				},
			},
		};
		expect(formatMetadata(metadata)).toBe("position: 10x20 px");
	});

	it("handles unknown type", () => {
		const metadata: Metadata = {
			foo: { type: "Unknown" as any, value: 123 },
		};
		expect(formatMetadata(metadata)).toBe("foo:unknown");
	});

	it("returns empty string for empty metadata", () => {
		expect(formatMetadata({})).toBe("");
	});

	it("handles deeply nested objects", () => {
		const metadata: Metadata = {
			outer: {
				type: "Object",
				value: {
					inner: {
						type: "Object",
						value: {
							value: { type: "String", value: "deep" },
						},
					},
				},
			},
		};
		expect(formatMetadata(metadata)).toBe("outer: [inner: [value:deep]]");
	});

	it("ignores Position type in output", () => {
		const metadata: Metadata = {
			pos: { type: "Position", value: { x: 1, y: 2 } },
			name: { type: "String", value: "abc" },
		};
		expect(formatMetadata(metadata)).toBe("name:abc");
	});
});

describe("metadataToJSON", () => {
	it("converts metadata to JSON", () => {
		const metadata: Metadata = {
			enabled: { type: "Boolean", value: false },
			name: { type: "String", value: "abc" },
			count: { type: "Number", value: 42 },
		};
		expect(metadataToJSON(metadata)).toEqual({
			enabled: false,
			name: "abc",
			count: 42,
		});
	});

	it("converts nested object metadata to JSON", () => {
		const metadata: Metadata = {
			size: {
				type: "Object",
				value: {
					width: { type: "Number", value: 50 },
					height: { type: "Number", value: 60 },
				},
			},
		};
		expect(metadataToJSON(metadata)).toEqual({
			size: { width: 50, height: 60 },
		});
	});

	it("converts position type", () => {
		const metadata: Metadata = {
			pos: { type: "Position", value: { x: 1, y: 2 } },
		};
		expect(metadataToJSON(metadata)).toEqual({ pos: { x: 1, y: 2 } });
	});

	it("returns empty object for empty metadata", () => {
		expect(metadataToJSON({})).toEqual({});
	});

	it("handles null and undefined values", () => {
		const metadata: Metadata = {
			foo: { type: "String", value: undefined as any },
			bar: { type: "Number", value: null },
		};
		expect(metadataToJSON(metadata)).toEqual({ foo: "undefined", bar: 0 });
	});

	it("handles unknown type", () => {
		const metadata: Metadata = {
			unknown: { type: "Unknown" as any, value: 123 },
		};
		expect(metadataToJSON(metadata)).toEqual({ unknown: null });
	});
});

describe("metadataToArray", () => {
	it("converts simple metadata to array", () => {
		const metadata: Metadata = {
			enabled: { type: "Boolean", value: true },
			name: { type: "String", value: "foo" },
			count: { type: "Number", value: 7 },
		};
		expect(metadataToArray(metadata)).toEqual([true, "foo", 7]);
	});

	it("converts nested object metadata to array", () => {
		const metadata: Metadata = {
			size: {
				type: "Object",
				value: {
					width: { type: "Number", value: 10 },
					height: { type: "Number", value: 20 },
				},
			},
		};
		expect(metadataToArray(metadata)).toEqual([10, 20]);
	});

	it("handle wrong type of number in nested object metadata to array", () => {
		const metadata: Metadata = {
			size: {
				type: "Object",
				value: {
					width: { type: "Number", value: "10" as any },
					height: { type: "Number", value: "20" as any },
				},
			},
		};
		expect(metadataToArray(metadata)).toEqual([10, 20]);
	});
	it("handle wrong type of string in nested object metadata to array", () => {
		const metadata: Metadata = {
			size: {
				type: "Object",
				value: {
					width: { type: "String", value: 10 as any },
					height: { type: "String", value: 20 as any },
				},
			},
		};
		expect(metadataToArray(metadata)).toEqual(["10", "20"]);
	});

	it("converts position type to array", () => {
		const metadata: Metadata = {
			pos: { type: "Position", value: { x: 3, y: 4 } },
		};
		expect(metadataToArray(metadata)).toEqual([3, 4]);
	});

	it("returns undefined for empty metadata", () => {
		expect(metadataToArray({})).toBe(undefined);
	});

	it("returns single value for one property", () => {
		const metadata: Metadata = {
			only: { type: "String", value: "one" },
		};
		expect(metadataToArray(metadata)).toBe("one");
	});

	it("handles nested empty object", () => {
		const metadata: Metadata = {
			obj: { type: "Object", value: {} },
		};
		expect(metadataToArray(metadata)).toEqual(undefined);
	});
});

describe("arrayToMetadata", () => {
	it("reconstructs metadata from array", () => {
		const metadata: Metadata = {
			enabled: { type: "Boolean", value: false },
			name: { type: "String", value: "" },
			count: { type: "Number", value: 0 },
		};
		const arr = [true, "bar", 9];
		expect(arrayToMetadata(metadata, arr)).toEqual({
			enabled: { type: "Boolean", value: true },
			name: { type: "String", value: "bar" },
			count: { type: "Number", value: 9 },
		});
	});

	it("reconstructs nested object metadata from array", () => {
		const metadata: Metadata = {
			size: {
				type: "Object",
				value: {
					width: { type: "Number", value: 0 },
					height: { type: "Number", value: 0 },
				},
			},
		};
		const arr = [11, 22];
		expect(arrayToMetadata(metadata, arr)).toEqual({
			size: {
				type: "Object",
				value: {
					width: { type: "Number", value: 11 },
					height: { type: "Number", value: 22 },
				},
			},
		});
	});

	it("handles empty metadata and array", () => {
		expect(arrayToMetadata({}, [])).toEqual({});
	});

	it("formats object with multi nested object", () => {
		const metadata: Metadata = {
			size: {
				type: "Object",
				value: {
					x: { type: "Number", value: 50 },
					y: { type: "Number", value: 50 },
				},
			},
			crop_position: {
				type: "Object",
				value: {
					x: { type: "Number", value: 100 },
					y: { type: "Number", value: 100 },
				},
			},
		};
		const data = [
			[50, 50],
			[100, 100],
		];
		expect(arrayToMetadata(metadata, data)).toEqual(metadata);
	});

	it("handles array with fewer elements than metadata keys", () => {
		const metadata: Metadata = {
			a: { type: "String", value: "" },
			b: { type: "Number", value: 0 },
			c: { type: "Boolean", value: false },
		};
		expect(arrayToMetadata(metadata, ["x"])).toEqual({
			a: { type: "String", value: "x" },
			b: { type: "Number", value: 0 },
			c: { type: "Boolean", value: false },
		});
	});

	it("handles array with more elements than metadata keys", () => {
		const metadata: Metadata = {
			a: { type: "String", value: "" },
		};
		expect(arrayToMetadata(metadata, ["x", 1, true])).toEqual({
			a: { type: "String", value: "x" },
		});
	});

	it("handles complex mixed nested structure with arrays and primitives", () => {
		const metadata: Metadata = {
			profile: {
				type: "Object",
				value: {
					personal: {
						type: "Object",
						value: {
							name: { type: "String", value: "" },
							age: { type: "Number", value: 0 },
							active: { type: "Boolean", value: false },
						},
					},
					preferences: {
						type: "Object",
						value: {
							theme: { type: "String", value: "default" },
							notifications: { type: "Boolean", value: true },
						},
					},
					stats: {
						type: "Object",
						value: {
							points: { type: "Number", value: 0 },
							rank: { type: "String", value: "beginner" },
						},
					},
				},
			},
			settings: {
				type: "Object",
				value: {
					enabled: { type: "Boolean", value: false },
					level: { type: "Number", value: 1 },
				},
			},
		};

		const arr = [
			[
				["John Doe", 30, true],
				["dark", false],
				[1000, "expert"],
			],
			[true, 5],
		];

		const expected = {
			profile: {
				type: "Object",
				value: {
					personal: {
						type: "Object",
						value: {
							name: { type: "String", value: "John Doe" },
							age: { type: "Number", value: 30 },
							active: { type: "Boolean", value: true },
						},
					},
					preferences: {
						type: "Object",
						value: {
							theme: { type: "String", value: "dark" },
							notifications: { type: "Boolean", value: false },
						},
					},
					stats: {
						type: "Object",
						value: {
							points: { type: "Number", value: 1000 },
							rank: { type: "String", value: "expert" },
						},
					},
				},
			},
			settings: {
				type: "Object",
				value: {
					enabled: { type: "Boolean", value: true },
					level: { type: "Number", value: 5 },
				},
			},
		};

		expect(arrayToMetadata(metadata, arr)).toEqual(expected);
	});

	it("handles deeply nested object", () => {
		const metadata: Metadata = {
			outer: {
				type: "Object",
				value: {
					inner: {
						type: "Object",
						value: {
							value: { type: "Number", value: 0 },
						},
					},
				},
			},
		};
		expect(arrayToMetadata(metadata, [[42]])).toEqual({
			outer: {
				type: "Object",
				value: {
					inner: {
						type: "Object",
						value: {
							value: { type: "Number", value: 42 },
						},
					},
				},
			},
		});
	});
});
