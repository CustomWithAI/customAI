import { generateUniqueColor } from "../color-utils";
import { generateRandomLabel } from "../random";

describe("generateUniqueColor", () => {
	it("should return a valid hex color string", () => {
		const { color } = generateRandomLabel();
		expect(color).toMatch(/^#[0-9A-F]{6}$/i);
	});

	it("should generate unique colors for different seeds", () => {
		const color1 = generateUniqueColor(1);
		const color2 = generateUniqueColor(2);

		expect(color1).not.toBe(color2);
	});

	it("should generate the same color for the same seed", () => {
		const color1 = generateUniqueColor(10);
		const color2 = generateUniqueColor(10);

		expect(color1).toBe(color2);
	});

	it("should generate distinct colors across multiple seeds", () => {
		const color1 = generateUniqueColor(10);
		const color2 = generateUniqueColor(20);
		const color3 = generateUniqueColor(30);

		expect(color1).not.toBe(color2);
		expect(color1).not.toBe(color3);
		expect(color2).not.toBe(color3);
	});
});
