import type { Metadata } from "@/stores/dragStore";

export const formatMetadata = (metadata: Metadata): string =>
	Object.entries(metadata)
		.map(([key, value]) => {
			switch (value.type) {
				case "Boolean":
				case "String":
				case "Number":
					return `${key}:${value.value}`;
				case "Object":
					if ("x" in value.value && "y" in value.value) {
						return `${key}: ${value.value.x.value}x${value.value.y.value} px`;
					}
					return `${key}: [${formatMetadata(value.value)}]`;
				case "Position":
					return "";
				default:
					return `${key}:unknown`;
			}
		})
		.filter((entry) => entry !== "")
		.join(", ");

export function metadataToJSON(metadata: Metadata): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(metadata).map(([key, value]) => {
			switch (value.type) {
				case "Boolean":
				case "String":
				case "Number":
					return [key, value.value];
				case "Object":
					return [key, metadataToJSON(value.value)];
				case "Position":
					return [key, { x: value.value.x, y: value.value.y }];
				default:
					return [key, null];
			}
		}),
	);
}
