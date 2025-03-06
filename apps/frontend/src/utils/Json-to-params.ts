export const jsonToParams = (obj: Record<string, any>): string => {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null) {
			params.append(key, String(value));
		}
	}

	return `${params.toString()?.length > 0 ? "?" : ""}${params.toString()}`;
};
