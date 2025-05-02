import { generateUniqueColor } from "./color-utils";

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

export function generateRandomLabel(): { name: string; color: string } {
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];
	const seed = adjective.charCodeAt(0) * 100 + noun.charCodeAt(0);
	const color = generateUniqueColor(seed);

	return {
		name: `${adjective}${noun}`,
		color,
	};
}
