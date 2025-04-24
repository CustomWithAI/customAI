import type { FilterOption } from "@/components/specific/filter/dialog";
import type { FilterCapability, FilterConfig } from "@/types/filter";

type FieldOptionsByCapability = {
	[capability in FilterCapability]?: {
		label?: string;
		type?: "checkbox" | "text" | "number" | "select" | "sort";
		options?: { value: string; label: string }[];
	};
};

export type FieldOptions = {
	[key: string]:
		| {
				label?: string;
				type?: "checkbox" | "text" | "number" | "select" | "sort";
				options?: { value: string; label: string }[];
		  }
		| FieldOptionsByCapability;
};

export function generateFilterOptions<T>(
	config: FilterConfig<T>,
	fieldOptions: FieldOptions = {},
): FilterOption[] {
	const options: FilterOption[] = [];
	for (const [field, capabilities] of Object.entries(config)) {
		const fieldConfig = fieldOptions[field] || {};
		for (const capability of capabilities as FilterCapability[]) {
			let baseLabel: string;

			if ("label" in fieldConfig) {
				baseLabel =
					String(fieldConfig.label) ||
					field.charAt(0).toUpperCase() +
						field.slice(1).replace(/([A-Z])/g, " $1");
			} else {
				baseLabel =
					field.charAt(0).toUpperCase() +
					field.slice(1).replace(/([A-Z])/g, " $1");
			}

			const capabilityOptions =
				"filter" in fieldConfig ||
				"search" in fieldConfig ||
				"sort" in fieldConfig
					? (fieldConfig as FieldOptionsByCapability)[capability]
					: undefined;

			if (capabilityOptions) {
				options.push({
					id: field,
					label:
						capabilityOptions.label ||
						`${capability.charAt(0).toUpperCase() + capability.slice(1)} ${baseLabel}`,
					type:
						capabilityOptions.type || getDefaultTypeForCapability(capability),
					options: capabilityOptions.options,
					capability: capability,
				});
				continue;
			}

			if (
				!("filter" in fieldConfig) &&
				!("search" in fieldConfig) &&
				!("sort" in fieldConfig)
			) {
				options.push({
					id: field,
					label: getDefaultLabelForCapability(baseLabel, capability),
					type:
						(fieldConfig as any).type ||
						getDefaultTypeForCapability(capability),
					options: (fieldConfig as any).options,
					capability: capability,
				});
				continue;
			}

			options.push({
				id: field,
				label: getDefaultLabelForCapability(baseLabel, capability),
				type: getDefaultTypeForCapability(capability),
				capability: capability,
			});
		}
	}

	return options;
}

function getDefaultLabelForCapability(
	baseLabel: string,
	capability: FilterCapability,
): string {
	switch (capability) {
		case "filter":
			return `Filter by ${baseLabel}`;
		case "search":
			return `Search in ${baseLabel}`;
		case "sort":
			return `Sort by ${baseLabel}`;
		default:
			return baseLabel;
	}
}

function getDefaultTypeForCapability(
	capability: FilterCapability,
): "checkbox" | "text" | "number" | "select" | "sort" {
	switch (capability) {
		case "filter":
			return "text";
		case "search":
			return "text";
		case "sort":
			return "sort";
		default:
			return "text";
	}
}
