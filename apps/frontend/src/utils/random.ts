const adjectives = [
	"Happy",
	"Sunny",
	"Swift",
	"Bright",
	"Clever",
	"Gentle",
	"Bold",
	"Soft",
	"Large",
	"Calm",
	"Eager",
	"Fancy",
];

const nouns = [
	"Star",
	"Cloud",
	"River",
	"Forest",
	"Mountain",
	"Ocean",
	"Sea",
	"Wind",
	"Garden",
	"Meadow",
	"Valley",
	"Breeze",
];

const colors = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#84cc16",
	"#22c55e",
	"#14b8a6",
	"#3b82f6",
	"#6366f1",
	"#a855f7",
	"#ec4899",
];

export function generateRandomLabel(): { name: string; color: string } {
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];
	const color = colors[Math.floor(Math.random() * colors.length)];

	return {
		name: `${adjective}${noun}`,
		color,
	};
}
