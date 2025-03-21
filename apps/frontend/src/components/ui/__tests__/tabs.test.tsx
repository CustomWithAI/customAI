import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";

describe("Tabs", () => {
	const TestTabs = () => (
		<Tabs defaultValue="tab1">
			<TabsList>
				<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				<TabsTrigger value="tab2">Tab 2</TabsTrigger>
				<TabsTrigger value="tab3" disabled>
					Tab 3
				</TabsTrigger>
			</TabsList>
			<TabsContent value="tab1">Tab 1 content</TabsContent>
			<TabsContent value="tab2">Tab 2 content</TabsContent>
			<TabsContent value="tab3">Tab 3 content</TabsContent>
		</Tabs>
	);

	it("renders all tab triggers", () => {
		render(<TestTabs />);
		expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "Tab 3" })).toBeInTheDocument();
	});

	it("renders with default tab selected", () => {
		render(<TestTabs />);
		expect(screen.getByText("Tab 1 content")).toBeVisible();
		expect(screen.queryByText("Tab 2 content")).not.toBeVisible();
		expect(screen.queryByText("Tab 3 content")).not.toBeVisible();
	});

	it("switches content when clicking different tabs", async () => {
		render(<TestTabs />);

		const tab2 = screen.getByRole("tab", { name: "Tab 2" });
		fireEvent.click(tab2);

		await waitFor(() => {
			expect(screen.getByText("Tab 2 content")).toBeVisible();
			expect(screen.queryByText("Tab 1 content")).not.toBeVisible();
		});

		const tab3 = screen.getByRole("tab", { name: "Tab 3" });
		fireEvent.click(tab3);

		await waitFor(() => {
			expect(screen.getByText("Tab 2 content")).toBeVisible();
			expect(screen.queryByText("Tab 3 content")).not.toBeVisible();
		});
	});

	it("applies correct ARIA attributes", () => {
		render(<TestTabs />);

		const tab1 = screen.getByRole("tab", { name: "Tab 1" });
		const tab2 = screen.getByRole("tab", { name: "Tab 2" });
		const tab3 = screen.getByRole("tab", { name: "Tab 3" });

		expect(tab1).toHaveAttribute("aria-selected", "true");
		expect(tab2).toHaveAttribute("aria-selected", "false");
		expect(tab3).toHaveAttribute("aria-selected", "false");
		expect(tab3).toHaveAttribute("disabled", "");
	});

	it("applies custom className to components", () => {
		render(
			<Tabs className="custom-class">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">Content</TabsContent>
			</Tabs>,
		);

		expect(screen.getByRole("tablist").parentElement).toHaveClass(
			"custom-class",
		);
	});
});
