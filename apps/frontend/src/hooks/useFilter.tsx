"use client";

import { useFilterStore } from "@/stores/filterStore";
import type {
	FilterCapability,
	FilterConfig,
	FilterParams,
	FilterValue,
} from "@/types/filter";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type UseFiltersOptions<T> = {
	config: FilterConfig<T>;
	initialFilters?: FilterValue;
	manualFilters?: FilterValue;
};

export type UseFiltersResult = {
	filters: FilterValue;
	setFilter: (key: string, value: any) => void;
	resetFilters: () => void;
	removeFilter: (key: string) => void;
	getParams: (
		type?: FilterCapability,
	) => FilterParams | string | Record<string, any> | null;
	isFiltered: boolean;
	activeFilters: Array<{
		id: string;
		label: string;
		value: any;
		capability: FilterCapability;
		isManual?: boolean;
	}>;
	manualFilters: FilterValue;
	setManualFilter: (
		key: string,
		value: any,
		capability?: FilterCapability,
	) => void;
	resetManualFilters: () => void;
	removeManualFilter: (key: string) => void;
	combinedFilters: FilterValue;
	getCapability: (key: string, value: any) => FilterCapability;
};

type ManualFilterCapabilities = Record<string, FilterCapability>;

export function useFilters<T>({
	config,
	initialFilters = {},
	manualFilters: initialManualFilters = {},
}: UseFiltersOptions<T>): UseFiltersResult {
	const {
		filters,
		setFilter,
		resetFilters,
		removeFilter,
		setConfig,
		getParams,
	} = useFilterStore();
	const [manualFilters, setManualFilters] =
		useState<FilterValue>(initialManualFilters);
	const [manualFilterCapabilities, setManualFilterCapabilities] =
		useState<ManualFilterCapabilities>({});
	const isFirstRender = useRef(true);
	useEffect(() => {
		setConfig(config);
		if (
			isFirstRender.current &&
			initialFilters &&
			Object.keys(filters).length === 0
		) {
			for (const [key, value] of Object.entries(initialFilters)) {
				setFilter(key, value);
			}
			isFirstRender.current = false;
		}
	}, [config, initialFilters, setConfig, setFilter, filters]);

	const getCapability = useCallback(
		(key: string, value: any): FilterCapability => {
			const capabilities = config[key as keyof T] || [];

			if (manualFilterCapabilities[key]) {
				return manualFilterCapabilities[key];
			}

			if (typeof value === "string" && value.startsWith("sort:")) {
				return "sort";
			}

			if (capabilities.includes("search") && capabilities.includes("filter")) {
				return "search";
			}

			return capabilities[0] || "filter";
		},
		[config, manualFilterCapabilities],
	);

	const setManualFilter = useCallback(
		(key: string, value: any, capability?: FilterCapability) => {
			setManualFilters((prev) => ({
				...prev,
				[key]: value,
			}));

			if (capability) {
				setManualFilterCapabilities((prev) => ({
					...prev,
					[key]: capability,
				}));
			}
		},
		[],
	);

	const resetManualFilters = useCallback(() => {
		setManualFilters({});
		setManualFilterCapabilities({});
	}, []);

	const removeManualFilter = useCallback((key: string) => {
		setManualFilters((prev) => {
			const newFilters = { ...prev };
			delete newFilters[key];
			return newFilters;
		});

		setManualFilterCapabilities((prev) => {
			const newCapabilities = { ...prev };
			delete newCapabilities[key];
			return newCapabilities;
		});
	}, []);

	const combinedFilters = useMemo(() => {
		return {
			...filters,
			...manualFilters,
		};
	}, [filters, manualFilters]);

	const getCombinedParams = useCallback(
		(type?: FilterCapability) => {
			if (type) {
				return formatParamsByType(
					combinedFilters,
					config as Record<string, FilterCapability[]>,
					type,
					manualFilterCapabilities,
				);
			}

			return {
				search: formatParamsByType(
					combinedFilters,
					config as Record<string, FilterCapability[]>,
					"search",
					manualFilterCapabilities,
				) as string,
				filter: formatParamsByType(
					combinedFilters,
					config as Record<string, FilterCapability[]>,
					"filter",
					manualFilterCapabilities,
				) as Record<string, any>,
				sort: formatParamsByType(
					combinedFilters,
					config as Record<string, FilterCapability[]>,
					"sort",
					manualFilterCapabilities,
				) as string,
			};
		},
		[combinedFilters, config, manualFilterCapabilities],
	);

	const isFiltered = useMemo(() => {
		return Object.entries(combinedFilters).some(([_, value]) => {
			if (typeof value === "boolean") return value;
			if (Array.isArray(value)) return value.length > 0;
			return value !== "" && value !== undefined && value !== null;
		});
	}, [combinedFilters]);

	const activeFilters = useMemo(() => {
		const result: Array<{
			id: string;
			label: string;
			value: any;
			capability: FilterCapability;
			isManual?: boolean;
		}> = [];

		for (const [id, value] of Object.entries(filters).filter(([_, value]) => {
			if (typeof value === "boolean") return value;
			if (Array.isArray(value)) return value.length > 0;
			return value !== "" && value !== undefined && value !== null;
		})) {
			result.push({
				id,
				label:
					id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, " $1"),
				value:
					typeof value === "string" && value.startsWith("sort:")
						? value.replace("sort:", "")
						: value,
				capability: getCapability(id, value),
				isManual: false,
			});
		}

		for (const [id, value] of Object.entries(manualFilters).filter(
			([_, value]) => {
				if (typeof value === "boolean") return value;
				if (Array.isArray(value)) return value.length > 0;
				return value !== "" && value !== undefined && value !== null;
			},
		)) {
			result.push({
				id,
				label:
					id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, " $1"),
				value:
					typeof value === "string" && value.startsWith("sort:")
						? value.replace("sort:", "")
						: value,
				capability: getCapability(id, value),
				isManual: true,
			});
		}

		return result;
	}, [filters, manualFilters, getCapability]);

	return {
		filters,
		setFilter,
		resetFilters,
		removeFilter,
		getParams: getCombinedParams,
		isFiltered,
		activeFilters,
		manualFilters,
		setManualFilter,
		resetManualFilters,
		removeManualFilter,
		combinedFilters,
		getCapability,
	};
}

// Helper function to format parameters by type
function formatParamsByType(
	filters: FilterValue,
	config: Record<string, FilterCapability[]>,
	type: FilterCapability,
	manualCapabilities: Record<string, FilterCapability> = {},
): string | Record<string, any> | null {
	switch (type) {
		case "search": {
			const searchTerms = Object.entries(filters)
				.filter(([key, value]) => {
					// Check if this is a manual filter with a specified capability
					if (manualCapabilities[key] === "search") {
						return value !== "" && value !== null && value !== undefined;
					}

					return (
						config[key]?.includes("search") &&
						value !== "" &&
						value !== null &&
						value !== undefined &&
						!Array.isArray(value) &&
						typeof value !== "boolean" &&
						!String(value).startsWith("sort:")
					);
				})
				.map(([key, value]) => `${key}:${value}`);

			return searchTerms.length > 0 ? searchTerms.join(" ") : null;
		}

		case "filter": {
			const filterParams: Record<string, any> = {};

			for (const [key, value] of Object.entries(filters)) {
				if (manualCapabilities[key] && manualCapabilities[key] !== "filter") {
					return null;
				}

				if (
					config[key]?.includes("filter") &&
					value !== "" &&
					value !== null &&
					value !== undefined &&
					!String(value).startsWith("sort:")
				) {
					filterParams[key] = value;
				}
			}

			return Object.keys(filterParams).length > 0 ? filterParams : null;
		}

		case "sort": {
			const sortTerms = Object.entries(filters)
				.filter(([key, value]) => {
					if (manualCapabilities[key] === "sort") {
						return true;
					}

					return (
						config[key]?.includes("sort") &&
						typeof value === "string" &&
						value.startsWith("sort:")
					);
				})
				.map(([key, value]) => {
					const direction =
						typeof value === "string" && value.startsWith("sort:")
							? value.replace("sort:", "")
							: "asc";
					return `${key}:${direction}`;
				});

			return sortTerms.length > 0 ? sortTerms.join(",") : null;
		}

		default:
			return null;
	}
}
