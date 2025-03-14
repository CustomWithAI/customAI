export function formatCapital(name: string): string {
	return name
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^./, (str) => str.toUpperCase());
}

export function formatUnderScore(name: string): string {
	return name
		.split("_")
		.map((t) => t.replace(/^./, (str) => str.toUpperCase()))
		.join(" ");
}
