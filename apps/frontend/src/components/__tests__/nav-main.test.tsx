import { render, screen, waitFor } from "@/test/test-utils";
import { act } from "@testing-library/react";
import { Home, Search, Sparkles } from "lucide-react";
import { NavMain } from "../nav-main";

// Mock the next-intl useTranslations hook
jest.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}));

describe("NavMain", () => {
	const mockItems = [
		{
			title: "Home",
			url: "/",
			icon: Home,
			isActive: true,
		},
		{
			title: "Search",
			url: "/search",
			icon: Search,
			items: [
				{
					title: "Recent",
					url: "/search/recent",
					isActive: false,
				},
				{
					title: "Saved",
					url: "/search/saved",
					isActive: false,
				},
			],
		},
		{
			title: "Ask AI",
			url: "/ask",
			icon: Sparkles,
		},
	];

	it("renders all main navigation items", () => {
		render(<NavMain items={mockItems} />);
		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Search")).toBeInTheDocument();
		expect(screen.getByText("Ask AI")).toBeInTheDocument();
	});

	it("renders sub-items when present", async () => {
		render(<NavMain items={mockItems} />);
		const searchButton = screen.getByText("Search");

		await act(async () => {
			searchButton.click();
		});

		await waitFor(() => {
			expect(screen.getByText("Recent")).toBeInTheDocument();
			expect(screen.getByText("Saved")).toBeInTheDocument();
		});
	});

	it("renders icons for main items", () => {
		render(<NavMain items={mockItems} />);
		// Icons are rendered as SVG elements
		const icons = document.querySelectorAll("svg");
		expect(icons.length).toBeGreaterThanOrEqual(3); // At least 3 main icons
	});

	it("marks active items correctly", () => {
		render(<NavMain items={mockItems} />);
		const homeLink = screen.getByText("Home").closest("a");
		expect(homeLink).toHaveAttribute("data-active", "true");
	});
});
