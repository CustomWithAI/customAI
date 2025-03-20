import type { QueryParams } from "@/hooks/use-query-params";

type QueryValue =
	| string
	| number
	| boolean
	| Record<string, string | number | boolean | null>;

export function buildQueryParams(params: QueryParams): string | null {
	if (!params) return null;
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value === "" || value === null || value === undefined) continue;

		if (typeof value === "object" && !Array.isArray(value)) {
			const nestedParams = Object.entries(value)
				.map(([subKey, subValue]) => {
					if (subValue === "" || subValue === null || subValue === undefined)
						return null;
					return `${subKey}:${subValue}`;
				})
				.filter(Boolean)
				.join(",");

			if (nestedParams) {
				searchParams.append(key, nestedParams);
			}
		} else {
			searchParams.append(key, String(value));
		}
	}

	return `?${searchParams.toString()}`;
}
