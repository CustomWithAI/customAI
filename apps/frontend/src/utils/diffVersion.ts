export type DiffResult = {
	title: string;
	old: string;
	new: string;
};

export function diffObjects<T extends Record<string, any>>(
	oldObj: T | undefined,
	newObj: T,
	includeKeys: (keyof T)[],
	excludeSubKey: string[] = [],
): DiffResult[] {
	const toStr = (val: any): string =>
		val === null || val === undefined
			? "-"
			: typeof val === "object"
				? JSON.stringify(val)
				: val.toString();

	const walk = (oldVal: any, newVal: any, path: string[]): DiffResult[] => {
		if (Array.isArray(newVal)) {
			const oldArr = Array.isArray(oldVal) ? oldVal : [];
			const oldStr = JSON.stringify(oldArr);
			const newStr = JSON.stringify(newVal);

			if (oldStr !== newStr) {
				return [
					{
						title: path.join(" "),
						old: oldStr,
						new: newStr,
					},
				];
			}
			return [];
		}

		if (
			typeof newVal === "object" &&
			newVal !== null &&
			(typeof oldVal === "object" || oldVal === undefined)
		) {
			const keys = new Set([
				...Object.keys(oldVal ?? {}),
				...Object.keys(newVal ?? {}),
			]);
			for (const key of excludeSubKey) keys.delete(key);

			return [...Array.from(keys)].flatMap((key) =>
				walk(oldVal?.[key], newVal?.[key], [...path, key]),
			);
		}

		const oldStr = toStr(oldVal);
		const newStr = toStr(newVal);

		if (oldStr !== newStr) {
			return [
				{
					title: path.join(" "),
					old: oldStr,
					new: newStr,
				},
			];
		}

		return [];
	};

	return includeKeys.flatMap((key) =>
		walk(oldObj?.[key], newObj[key], [key as string]),
	);
}
