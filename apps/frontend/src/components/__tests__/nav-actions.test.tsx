import { render } from "@/test/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import { NavActions } from "../nav-actions";
import "@testing-library/jest-dom";

describe("NavActions", () => {
	it("renders the edit date", () => {
		render(<NavActions />);
		expect(screen.getByText("Edit Oct 08")).toBeInTheDocument();
	});

	it("renders the star button", () => {
		render(<NavActions />);
		expect(screen.getByRole("button", { name: /star/i })).toBeInTheDocument();
	});

	it("opens popover menu when more button is clicked", () => {
		render(<NavActions />);
		const moreButton = screen.getByRole("button", { name: /more horizontal/i });
		fireEvent.click(moreButton);

		// Check if menu items are visible
		expect(screen.getByText("Customize Page")).toBeInTheDocument();
		expect(screen.getByText("Turn into wiki")).toBeInTheDocument();
		expect(screen.getByText("Copy Link")).toBeInTheDocument();
	});

	it("renders all menu groups", () => {
		render(<NavActions />);
		const moreButton = screen.getByRole("button", { name: /more horizontal/i });
		fireEvent.click(moreButton);

		// Check one item from each group
		const menuItems = ["Customize Page", "Copy Link", "Undo", "Import"];

		for (const item of menuItems) {
			expect(screen.getByText(item)).toBeInTheDocument();
		}
	});

	it("has correct button styling", () => {
		render(<NavActions />);
		const starButton = screen.getByRole("button", { name: /star/i });
		const moreButton = screen.getByRole("button", { name: /more horizontal/i });

		expect(starButton).toHaveClass("h-7", "w-7");
		expect(moreButton).toHaveClass("h-7", "w-7");
	});
});
