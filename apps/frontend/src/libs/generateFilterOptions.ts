import type { FilterOption } from "@/components/specific/filter/dialog";
import type { FilterCapability, FilterConfig } from "@/types/filter";

export type FieldOptions = {
	[key: string]: {
		label?: string;
		type?: "checkbox" | "text" | "number" | "select" | "sort";
		options?: { value: string; label: string }[];
	};
};

export function generateFilterOptions<T>(
	config: FilterConfig<T>,
	fieldOptions: FieldOptions = {},
): FilterOption[] {
	const options: FilterOption[] = [];
	for (const [field, capabilities] of Object.entries(config)) {
		const fieldConfig = fieldOptions[field] || {};
		const baseLabel =
			fieldConfig.label ||
			field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1");
		for (const capability of capabilities as FilterCapability[]) {
			if (fieldConfig.type) {
				options.push({
					id: field,
					label: baseLabel,
					type: fieldConfig.type,
					options: fieldConfig.options,
					capability: capability,
				});
				continue;
			}

			switch (capability) {
				case "filter":
					options.push({
						id: field,
						label: `Filter by ${baseLabel}`,
						type: "text",
						capability: "filter",
					});
					break;

				case "search":
					options.push({
						id: field,
						label: `Search in ${baseLabel}`,
						type: "text",
						capability: "search",
					});
					break;

				case "sort":
					options.push({
						id: field,
						label: `Sort by ${baseLabel}`,
						type: "sort",
						capability: "sort",
					});
					break;
			}
		}
	}

	return options;
}
