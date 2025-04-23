export const ilikeArrayFilter = <T extends Record<string, any>>(
	data: T[],
	key: keyof T,
	search: string,
): T[] => {
	if (!search.trim()) return data;
	const pattern = search.toLowerCase();
	return data.filter((item) =>
		String(item[key] ?? "")
			.toLowerCase()
			.includes(pattern),
	);
};
