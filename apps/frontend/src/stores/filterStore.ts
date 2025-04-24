import type {
	FilterCapability,
	FilterConfig,
	FilterParams,
	FilterValue,
} from "@/types/filter";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
	filters: FilterValue;
	config: Record<string, FilterCapability[]>;
	setFilter: (key: string, value: any) => void;
	resetFilters: () => void;
	removeFilter: (key: string) => void;
	setConfig: <T>(config: FilterConfig<T>) => void;
	getParams: (
		type?: FilterCapability,
	) => FilterParams | string | Record<string, any> | null;
}

export const useFilterStore = create<FilterState>()(
	persist(
		(set, get) => ({
			filters: {},
			config: {},

			setFilter: (key, value) => {
				set((state) => ({
					filters: {
						...state.filters,
						[key]: value,
					},
				}));
			},

			resetFilters: () => {
				set({ filters: {} });
			},

			removeFilter: (key) => {
				set((state) => {
					const newFilters = { ...state.filters };
					delete newFilters[key];
					return { filters: newFilters };
				});
			},

			setConfig: (config) => {
				const currentConfig = get().config;
				const configStr = JSON.stringify(config);
				const currentConfigStr = JSON.stringify(currentConfig);

				if (configStr !== currentConfigStr) {
					set({ config: config as Record<string, FilterCapability[]> });
				}
			},

			getParams: (type) => {
				const { filters, config } = get();

				if (type) {
					return formatParamsByType(filters, config, type);
				}

				return {
					search: formatParamsByType(filters, config, "search") as string,
					filter: formatParamsByType(filters, config, "filter") as Record<
						string,
						any
					>,
					orderBy: formatParamsByType(filters, config, "sort") as string,
				};
			},
		}),
		{
			name: "filter-storage",
		},
	),
);

function formatParamsByType(
	filters: FilterValue,
	config: Record<string, FilterCapability[]>,
	type: FilterCapability,
): string | Record<string, any> | null {
	switch (type) {
		case "search": {
			const searchTerms = Object.entries(filters)
				.filter(([key, value]) => {
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
					return (
						config[key]?.includes("sort") &&
						typeof value === "string" &&
						value.startsWith("sort:")
					);
				})
				.map(([key, value]) => `${key}:${String(value).replace("sort:", "")}`);

			return sortTerms.length > 0 ? sortTerms.join(",") : null;
		}

		default:
			return null;
	}
}
