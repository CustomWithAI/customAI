export const formatSize = (bytes: number | string): string => {
	const numberBytes = Number(bytes);
	if (numberBytes >= 1024 ** 4)
		return `${(numberBytes / 1024 ** 4).toFixed(2)} TB`;
	if (numberBytes >= 1024 ** 3)
		return `${(numberBytes / 1024 ** 3).toFixed(2)} GB`;
	if (numberBytes >= 1024 ** 2)
		return `${(numberBytes / 1024 ** 2).toFixed(2)} MB`;
	if (numberBytes >= 1024) return `${(numberBytes / 1024).toFixed(2)} kB`;
	return `${bytes} B`;
};
