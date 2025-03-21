import { render, screen } from "@testing-library/react";
import { HomeMenu } from "../homeMenu";

describe("HomeMenu", () => {
	it("renders menu items", () => {
		render(<HomeMenu />);

		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("About")).toBeInTheDocument();
		expect(screen.getByText("Contact")).toBeInTheDocument();
	});

	it("renders with default styles", () => {
		render(<HomeMenu />);

		const menu = screen.getByRole("navigation");
		expect(menu).toHaveClass("flex", "items-center", "space-x-4");
	});

	it("renders menu items with correct links", () => {
		render(<HomeMenu />);

		const homeLink = screen.getByRole("link", { name: "Home" });
		const aboutLink = screen.getByRole("link", { name: "About" });
		const contactLink = screen.getByRole("link", { name: "Contact" });

		expect(homeLink).toHaveAttribute("href", "/");
		expect(aboutLink).toHaveAttribute("href", "/about");
		expect(contactLink).toHaveAttribute("href", "/contact");
	});
});
