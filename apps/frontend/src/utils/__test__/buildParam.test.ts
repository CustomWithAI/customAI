import type { QueryParams } from "@/hooks/use-query-params";
import { buildQueryParams } from "@/utils/build-param";

describe("buildQueryParams", () => {
	it("should return null if params is undefined", () => {
		const result = buildQueryParams(undefined);
		expect(result).toBeNull();
	});

	it("should return empty query when all values are null, undefined, or empty", () => {
		const input: QueryParams = {
			key1: null,
			key2: undefined,
			key3: "",
			nested: {
				a: null,
				b: "",
			},
		};
		const result = buildQueryParams(input);
		expect(result).toBe("?");
	});

	it("should build flat query params correctly", () => {
		const input: QueryParams = {
			page: 1,
			sort: "name",
			visible: true,
		};
		const result = buildQueryParams(input);
		expect(result).toBe("?page=1&sort=name&visible=true");
	});

	it("should skip null, undefined, and empty string in flat values", () => {
		const input: QueryParams = {
			a: "x",
			b: null,
			c: undefined,
			d: "",
		};
		const result = buildQueryParams(input);
		expect(result).toBe("?a=x");
	});

	it("should serialize nested object correctly", () => {
		const input: QueryParams = {
			filter: {
				status: "active",
				role: "admin",
			},
		};
		const result = buildQueryParams(input);
		expect(result).toBe("?filter=status%3Aactive%2Crole%3Aadmin");
	});

	it("should skip empty, null, or undefined values in nested objects", () => {
		const input: QueryParams = {
			filter: {
				status: "active",
				role: "",
				unused: null,
			},
		};
		const result = buildQueryParams(input);
		expect(result).toBe("?filter=status%3Aactive");
	});

	it("should mix flat and nested params correctly", () => {
		const input: QueryParams = {
			page: 2,
			filter: {
				tag: "featured",
				category: "news",
			},
			debug: true,
		};
		const result = buildQueryParams(input);
		expect(result).toBe(
			"?page=2&filter=tag%3Afeatured%2Ccategory%3Anews&debug=true",
		);
	});
});
