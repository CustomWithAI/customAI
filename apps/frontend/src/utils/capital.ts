export function formatCapital(name: string): string {
	return name
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^./, (str) => str.toUpperCase());
}
