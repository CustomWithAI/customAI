export function darkenColor(hex: string, amount: number): string {
	let color = hex.startsWith("#") ? hex.slice(1) : hex;
	if (color.length === 3) {
		color = color
			.split("")
			.map((c) => c + c)
			.join("");
	}

	const num = Number.parseInt(color, 16);
	const r = Math.max(0, (num >> 16) - amount);
	const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
	const b = Math.max(0, (num & 0x0000ff) - amount);

	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function brightenColor(hex: string, amount: number): string {
	let color = hex.startsWith("#") ? hex.slice(1) : hex;
	if (color.length === 3) {
		color = color
			.split("")
			.map((c) => c + c)
			.join("");
	}

	const num = Number.parseInt(color, 16);
	const r = Math.min(255, (num >> 16) + amount);
	const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
	const b = Math.min(255, (num & 0x0000ff) + amount);

	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
