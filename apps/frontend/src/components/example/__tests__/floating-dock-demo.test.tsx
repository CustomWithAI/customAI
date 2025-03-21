import { render, screen } from "@testing-library/react";
import FloatingDockDemo from "../floating-dock-demo";

describe("FloatingDockDemo", () => {
	it("renders all links with icons", () => {
		render(<FloatingDockDemo />);

		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(7);

		// Check for SVG icons and Image
		const svgIcons = document.querySelectorAll("svg");
		expect(svgIcons.length).toBeGreaterThan(0);
		expect(screen.getByAltText("Aceternity Logo")).toBeInTheDocument();
	});

	it("applies the correct mobile class name", () => {
		render(<FloatingDockDemo />);

		const mobileContainer = screen.getByTestId("mobile-dock");
		expect(mobileContainer).toHaveClass("translate-y-20");
	});

	it("renders all navigation items with correct titles", () => {
		render(<FloatingDockDemo />);

		const expectedTitles = [
			"Home",
			"Products",
			"Components",
			"Aceternity UI",
			"Changelog",
			"Twitter",
			"GitHub",
		];
		for (const title of expectedTitles) {
			const link = screen.getByTitle(title);
			expect(link).toBeInTheDocument();
		}
	});
});
