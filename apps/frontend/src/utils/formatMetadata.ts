import type { Metadata } from "@/stores/dragStore";

export function formatMetadata(metadata: Metadata): string {
	return Object.entries(metadata)
		.map(([key, value]) => {
			switch (value.type) {
				case "Boolean":
				case "String":
				case "Number":
					return `${key}:${value.value}`;
				case "Object":
					if ("x" in value.value && "y" in value.value) {
						return `${key}: (${formatMetadata(value.value)})`;
					}
					return `${key}:${JSON.stringify(value.value)}`;
				case "Position":
					return "";
				default:
					return `${key}:unknown`;
			}
		})
		.filter((entry) => entry !== "")
		.join(", ");
}
