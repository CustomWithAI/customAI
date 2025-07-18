/**
 * Increments a semantic version string based on the given type.
 *
 * @param version - The current version
 * @param type - The type of increment: `major.minor.patch`
 * @returns The incremented version string.
 *
 * @example
 * ```ts
 * incrementVersion("1.2.3", "minor"); // "1.3.0"
 * ```
 */
export const incrementVersion = (
	version: string,
	type: "major" | "minor" | "patch",
): string => {
	let [major, minor, patch] = version.split(".").map(Number);

	switch (type) {
		case "major": {
			major++;
			minor = 0;
			patch = 0;
			break;
		}
		case "minor": {
			minor++;
			patch = 0;
			break;
		}
		default: {
			patch++;
		}
	}

	return `${major}.${minor}.${patch}`;
};

export const roundUpVersion = (
	version: string,
	type: "major" | "minor" | "patch",
): string => {
	let [major, minor, patch] = version.split(".").map(Number);

	switch (type) {
		case "major":
		case "minor": {
			major++;
			minor = 0;
			patch = 0;
			break;
		}
		case "patch": {
			minor++;
			patch = 0;
		}
	}

	return `${major}.${minor}.${patch}`;
};
