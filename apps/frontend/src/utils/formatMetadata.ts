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
						return `${key}:${value.value.x}x${value.value.y}px`;
					}
					return `${key}:${JSON.stringify(value.value)}`;
				default:
					return `${key}:unknown`;
			}
		})
		.join(",");
}
