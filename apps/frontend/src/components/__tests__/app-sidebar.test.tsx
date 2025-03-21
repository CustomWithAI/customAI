import { render, screen } from "@/test/test-utils";
import { AppSidebar } from "../app-sidebar";

describe("AppSidebar", () => {
	it("renders without crashing", () => {
		render(<AppSidebar />);
		expect(screen.getByText("Custom AI")).toBeInTheDocument();
	});

	it("renders all main navigation items", () => {
		render(<AppSidebar />);
		const navItems = ["Search", "Ask AI", "Home", "Inbox"];
		for (const item of navItems) {
			expect(screen.getByText(item)).toBeInTheDocument();
		}
	});

	it("renders all secondary navigation items", () => {
		render(<AppSidebar />);
		const secondaryItems = [
			"Calendar",
			"Settings",
			"Templates",
			"Trash",
			"Help",
		];
		for (const item of secondaryItems) {
			expect(screen.getByText(item)).toBeInTheDocument();
		}
	});

	it("displays the correct team information", () => {
		render(<AppSidebar />);
		expect(screen.getByText("Custom AI")).toBeInTheDocument();
	});
});
