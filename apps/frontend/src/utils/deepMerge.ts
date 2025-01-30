import type { Metadata } from "@/stores/dragStore";
import type { DeepPartial } from "@/types/response/common";

export const deepMerge = (target: Metadata, source: Metadata): Metadata => {
	const result: Metadata = { ...target };

	for (const key in source) {
		if (!(key in target)) {
			const newEntry = source[key] as Metadata[keyof Metadata];
			if (!newEntry || !newEntry.type) {
				console.warn(`Missing 'type' for key "${key}"`);
				continue;
			}
			result[key] = newEntry;
		} else {
			const targetEntry = target[key];
			const sourceEntry = source[key];

			if (!sourceEntry) continue;

			if (targetEntry.type !== sourceEntry.type) {
				console.warn(
					`Type mismatch for key "${key}": expected ${targetEntry.type}, got ${sourceEntry.type}`,
				);
				continue;
			}

			if (
				targetEntry.type === "Object" &&
				typeof sourceEntry.value === "object"
			) {
				result[key] = {
					type: "Object",
					value: deepMerge(targetEntry.value, sourceEntry.value as Metadata),
				};
			} else {
				result[key] = { ...targetEntry, ...sourceEntry };
			}
		}
	}
	return result;
};
