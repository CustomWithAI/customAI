import type { QueryParams } from "@/hooks/use-query-params";

type QueryValue =
	| string
	| number
	| boolean
	| Record<string, string | number | boolean | null>;

export function buildQueryParams(params: QueryParams): string | null {
	if (!params) return null;
	const queryParams = new URLSearchParams();
	const appendQueryParam = (key: string, value: QueryValue) => {
		if (typeof value === "object") {
			for (const subKey in value) {
				if (Object.hasOwn(value, subKey)) {
					const subValue = value[subKey];
					if (subValue) {
						queryParams.append(`${key}[${subKey}]`, String(subValue));
					}
				}
			}
		} else {
			queryParams.append(key, String(value));
		}
	};

	for (const key in params) {
		if (Object.hasOwn(params, key)) {
			const value = params[key];
			if (value !== undefined && value !== null) {
				appendQueryParam(key, value);
			}
		}
	}

	return `?${queryParams.toString()}`;
}
