export const isSameUnorderedArray = (a: string[], b: string[]) => {
	if (a.length !== b.length) return false;

	const count = new Map<string, number>();

	for (const val of a) {
		count.set(val, (count.get(val) ?? 0) + 1);
	}

	for (const val of b) {
		const current = count.get(val);
		if (!current) return false;
		count.set(val, current - 1);
	}

	return true;
};
