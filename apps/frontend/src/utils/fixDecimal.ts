export const fixDecimals = (num: number, options = 1e5): number => {
	return Math.trunc(num * options) / options;
};
