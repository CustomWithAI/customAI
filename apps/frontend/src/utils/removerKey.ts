export function removeKey<T extends object, K extends keyof T>(
	array: T[] | undefined,
	key: K,
): Omit<T, K>[] {
	if (!array) return [];
	return array.map((item) => {
		if (!(key in item)) return item;
		const { [key]: _, ...rest } = item;
		return rest;
	});
}
