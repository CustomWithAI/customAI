import { fireEvent, render, screen } from "../../../test/test-utils";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "../navigation-menu";

describe("NavigationMenu", () => {
	const TestNavigationMenu = () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div>Content 1</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink href="/test">Item 2</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger disabled>Item 3</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div>Content 3</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);

	it("renders navigation menu items", () => {
		render(<TestNavigationMenu />);
		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Item 2")).toBeInTheDocument();
		expect(screen.getByText("Item 3")).toBeInTheDocument();
	});

	it("renders navigation menu link with correct href", () => {
		render(<TestNavigationMenu />);
		const link = screen.getByText("Item 2");
		expect(link).toHaveAttribute("href", "/test");
	});

	it("shows content when trigger is clicked", async () => {
		render(<TestNavigationMenu />);
		const trigger = screen.getByText("Item 1");

		// Content should not be visible initially
		const contentBefore = screen.queryByText("Content 1");
		expect(contentBefore).not.toBeInTheDocument();

		// Click trigger
		fireEvent.click(trigger);

		// Content should be visible
		const contentAfter = await screen.findByText("Content 1");
		expect(contentAfter).toBeInTheDocument();
	});

	it("handles disabled trigger correctly", () => {
		render(<TestNavigationMenu />);
		const trigger = screen.getByText("Item 3");

		expect(trigger).toHaveAttribute("disabled");
		expect(trigger).toHaveClass(
			"disabled:pointer-events-none",
			"disabled:opacity-50",
		);

		// Click disabled trigger
		fireEvent.click(trigger);

		// Content should not be visible
		expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
	});

	it("applies custom className to components", () => {
		render(
			<NavigationMenu className="custom-menu">
				<NavigationMenuList className="custom-list">
					<NavigationMenuItem>
						<NavigationMenuTrigger className="custom-trigger">
							Test
						</NavigationMenuTrigger>
						<NavigationMenuContent className="custom-content">
							Content
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		expect(screen.getByRole("navigation")).toHaveClass("custom-menu");
		expect(screen.getByRole("list")).toHaveClass("custom-list");
		expect(screen.getByRole("button")).toHaveClass("custom-trigger");
	});

	it("renders chevron icon with trigger", () => {
		render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Test</NavigationMenuTrigger>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>,
		);

		const trigger = screen.getByRole("button");
		const chevron = trigger.querySelector("svg");
		expect(chevron).toBeInTheDocument();
		expect(chevron).toHaveClass("h-3", "w-3");
	});
});
