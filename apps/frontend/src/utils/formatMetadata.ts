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

export function metadataToJSON(
	metadata: Metadata,
	sub?: "array" | "json",
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(metadata).map(([key, value]) => {
			switch (value.type) {
				case "Boolean":
					return [key, value.value];
				case "String":
					return [key, String(value.value)];
				case "Number":
					return [key, Number(value.value)];
				case "Object":
					if (sub === "array") {
						return [key, metadataToArray(value.value)];
					}
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

	for (const [_, value] of Object.entries(metadata)) {
		switch (value.type) {
			case "Boolean":
				result.push(value.value);
				break;
			case "String":
				result.push(String(value.value));
				break;
			case "Number":
				result.push(Number(value.value));
				break;
			case "Object":
				result.push(metadataToArray(value.value as Metadata) as []);
				break;

			case "Position":
				if ("x" in value.value && "y" in value.value)
					result.push([value.value.x, value.value.y]);
				break;

			default:
				break;
		}
	}

	return result.length > 1 ? result : result[0];
}

function isSimpleObject(value: unknown): boolean {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function arrayToMetadata(
	metadata: Metadata,
	array: unknown[] | unknown,
): Metadata {
	let flattenedArray: unknown[] = [];

	function flatten(arr: unknown[]): void {
		for (const item of arr) {
			if (Array.isArray(item)) {
				flatten(item);
			} else {
				flattenedArray.push(item);
			}
		}
	}

	if (Array.isArray(array)) {
		flatten(array);
	} else {
		flattenedArray = [array];
	}

	let index = 0;

	function processMetadata(obj: Metadata): Metadata {
		const result: Metadata = {};

		for (const [key, value] of Object.entries(obj)) {
			if (value.type === "Object") {
				result[key] = {
					...value,
					value: processMetadata(value.value as Metadata),
				};
			} else if (index < flattenedArray.length) {
				const newValue = flattenedArray[index++];

				switch (value.type) {
					case "Number":
						result[key] = {
							...value,
							value: Number(newValue),
						};
						break;
					case "String":
						result[key] = {
							...value,
							value: String(newValue),
						};
						break;
					case "Boolean":
						result[key] = {
							...value,
							value: Boolean(newValue),
						};
						break;
					default:
						result[key] = value;
				}
			} else {
				result[key] = value;
			}
		}

		return result;
	}

	return processMetadata(metadata);
}
