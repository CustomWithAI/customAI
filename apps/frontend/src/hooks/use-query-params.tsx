import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type QueryParams =
	| Record<
			string,
			| string
			| number
			| boolean
			| Record<string, string | number | boolean | null>
			| undefined
			| null
	  >
	| undefined;

export function useQueryParam(defaultName?: { name?: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const Params = useSearchParams();

	function getQueryParam(): string | null;
	function getQueryParam(queryName: string, baseValue: string): string;
	function getQueryParam(queryName: string[], baseValue: string[]): string[];
	function getQueryParam(queryName: string): string | null;
	function getQueryParam(queryName: string[]): (string | null)[];
	function getQueryParam(
		queryName?: string | string[],
		baseValue?: string | string[],
	): string | (string | null)[] | null {
		const effectiveQueryName = queryName ?? defaultName?.name;
		if (!effectiveQueryName) {
			throw new Error("No query name provided or defaultName.name is not set.");
		}
		if (Array.isArray(effectiveQueryName)) {
			return effectiveQueryName.map((name, index) => {
				const param = Params.get(name);
				return param !== null
					? param
					: baseValue != null
						? Array.isArray(baseValue)
							? baseValue[index]
							: baseValue
						: null;
			});
		}
		const param = Params.get(effectiveQueryName);
		return param !== null ? param : baseValue || null;
	}

	const compareQueryParam = useCallback(
		({
			name = defaultName?.name,
			value,
			allowNull,
		}: {
			name?: string;
			value: string;
			allowNull?: boolean;
		}) => {
			if (!name) {
				throw new Error(
					"No query name provided or defaultName.name is not set.",
				);
			}
			const param = Params.get(name);
			return param === value || (!param && allowNull);
		},
		[Params, defaultName],
	);

	const createQueryParam = useCallback(
		({
			name = defaultName?.name,
			value,
			resetParams,
		}: {
			name?: string;
			value: string | null;
			resetParams?: boolean;
		}): string => {
			if (!name) {
				return "";
			}
			const params = new URLSearchParams(
				resetParams ? undefined : Params.toString(),
			);
			if (value) {
				params.set(name, value);
			} else {
				params.delete(name);
			}
			return params.toString();
		},
		[Params, defaultName],
	);

	const setQueryParam = useCallback(
		({
			name = defaultName?.name,
			value,
			resetParams,
		}: {
			name?: string;
			value: string | null;
			resetParams?: boolean;
		}): void => {
			if (!name) return;
			router.replace(
				`${pathname}?${createQueryParam({ name, value, resetParams })}`,
			);
		},
		[createQueryParam, pathname, router, defaultName],
	);

	const replaceQueryParam = useCallback(
		({
			oldKey,
			newKey,
			value,
		}: { oldKey: string; newKey: string; value: string | null }) => {
			const params = new URLSearchParams(Params.toString());
			if (params.has(oldKey)) {
				params.delete(oldKey);
			}
			if (value) {
				params.set(newKey, value);
			}
			const newQueryParam = params.toString();
			router.replace(pathname + (newQueryParam ? `?${newQueryParam}` : ""));
		},
		[router, Params, pathname],
	);

	const removeQueryParam = useCallback(
		(name: string | string[]) => {
			const params = new URLSearchParams(Params.toString());
			if (Array.isArray(name)) {
				for (const param of name) {
					params.delete(param);
				}
			} else {
				params.delete(name);
			}
			const newQueryParam = params.toString();
			router.replace(pathname + (newQueryParam ? `?${newQueryParam}` : ""));
		},
		[router, Params, pathname],
	);

	return {
		getQueryParam,
		replaceQueryParam,
		removeQueryParam,
		compareQueryParam,
		createQueryParam,
		setQueryParam,
	};
}
