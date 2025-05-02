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

export const getContrastColor = (r: number, g: number, b: number) => {
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	return luminance > 0.5 ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
};

export function generateUniqueColor(seed: number): string {
	const hue = (seed * 37.5) % 360;
	const saturation = 70 + Math.floor(Math.random() * 30);
	const lightness = 50 + Math.floor(Math.random() * 30);
	return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
	const normalizedS = s / 100;
	const normalizedL = l / 100;

	const k = (n: number) => (n + h / 30) % 12;
	const a = normalizedS * Math.min(normalizedL, 1 - normalizedL);
	const f = (n: number) =>
		Math.round(
			255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))),
		);

	return `#${[f(0), f(8), f(4)]
		.map((x) => x.toString(16).padStart(2, "0"))
		.join("")}`;
}
