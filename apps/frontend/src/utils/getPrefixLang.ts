export const getPrefixLang = (prefix: string | undefined) => {
	return prefix?.split("-")?.[0];
};
