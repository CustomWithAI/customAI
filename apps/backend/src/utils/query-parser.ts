/**
 *
 * @param queryString string in format `id:desc,createdAt:asc,updatedAt:desc`
 * @returns json key value pairs
 */
export function queryParser(
	queryString: string | undefined,
): Record<string, string> | undefined {
	if (!queryString) return undefined;
	const result: Record<string, string> = {};

	for (const item of queryString.split(",")) {
		const [key, direction] = item.split(":");

		if (key && direction) {
			result[key] = direction;
		}
	}

	return result;
}
