export const isSameUnorderedArray = <
	T extends string | Record<string, unknown>,
>(
	a: T[],
	b: T[],
) => {
	if (a.length !== b.length) return false;

	const used = new Array<boolean>(b.length).fill(false);

	for (const itemA of a) {
		let found = false;
		for (let i = 0; i < b.length; i++) {
			if (!used[i] && deepEqual(itemA, b[i])) {
				used[i] = true;
				found = true;
				break;
			}
		}
		if (!found) return false;
	}

	return true;
};

const deepEqual = (a: unknown, b: unknown): boolean => {
	if (a === b) return true;

	if (typeof a !== typeof b || a == null || b == null) return false;

	if (typeof a === "object") {
		if (Array.isArray(a)) {
			if (!Array.isArray(b) || a.length !== (b as unknown[]).length)
				return false;
			for (let i = 0; i < a.length; i++) {
				if (!deepEqual(a[i], (b as unknown[])[i])) return false;
			}
			return true;
		}

		const keysA = Object.keys(a as Record<string, unknown>);
		const keysB = Object.keys(b as Record<string, unknown>);
		if (keysA.length !== keysB.length) return false;

		for (const key of keysA) {
			if (
				!keysB.includes(key) ||
				!deepEqual(
					(a as Record<string, unknown>)[key],
					(b as Record<string, unknown>)[key],
				)
			) {
				return false;
			}
		}

		return true;
	}

	return false;
};
