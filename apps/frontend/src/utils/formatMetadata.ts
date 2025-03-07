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

export function metadataToArray(metadata: Metadata): unknown[] | unknown {
	const result: unknown[] = [];

	for (const [key, value] of Object.entries(metadata)) {
		switch (value.type) {
			case "Boolean":
			case "String":
			case "Number":
				result.push(value.value);
				break;
			case "Object":
				if (isSimpleObject(value.value)) {
					const flatObject = Object.entries(value.value)
						.map(([subKey, subValue]) => {
							if (subValue && subValue.type === "Number") {
								return subValue.value;
							}
							return undefined;
						})
						.filter((val) => val !== undefined);

					result.push(
						flatObject.length > 0 ? flatObject : metadataToArray(value.value),
					);
				} else {
					result.push(metadataToArray(value.value));
				}
				break;

			case "Position":
				result.push([value.value.x, value.value.y]);
				break;

			default:
				break;
		}
	}

	return result.length > 1 ? result : result[0];
}

// Helper function to detect simple objects
function isSimpleObject(value: any): boolean {
	return (
		value &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		value !== null
	);
}
