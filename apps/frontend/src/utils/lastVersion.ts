const compareVersions = (a: string, b: string) => {
	const [am, an, ap] = a.split(".").map(Number);
	const [bm, bn, bp] = b.split(".").map(Number);
	return am !== bm ? am - bm : an !== bn ? an - bn : ap - bp;
};

export const findPreviousVersion = <T extends { version: string }>(
	list: T[],
	target: string,
): T | undefined => {
	if (!list) return undefined;
	return (
		list
			.filter((item) => compareVersions(item.version, target) < 0)
			.sort((a, b) => compareVersions(b.version, a.version))[0] ?? null
	);
};
