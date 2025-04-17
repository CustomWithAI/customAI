export const toCapital = (strings: TemplateStringsArray | string) => {
	const text = typeof strings === "string" ? strings : strings.join("");
	return text
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_\-]+/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase())
		.trim();
};
