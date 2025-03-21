import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChevronRight } from "lucide-react";
import { Button } from "../button";

describe("Button", () => {
	it("renders with default props", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button")).toHaveTextContent("Click me");
	});

	it("applies variant styles correctly", () => {
		render(<Button variant="destructive">Delete</Button>);
		expect(screen.getByRole("button")).toHaveClass("bg-destructive");
	});

	it("applies size styles correctly", () => {
		render(<Button size="sm">Small</Button>);
		expect(screen.getByRole("button")).toHaveClass("h-9");
	});

	it("applies effect styles correctly", () => {
		render(<Button effect="shine">Shine</Button>);
		expect(screen.getByRole("button")).toHaveClass("before:animate-shine");
	});

	it("renders with left icon", () => {
		render(
			<Button icon={ChevronRight} iconPlacement="left">
				Next
			</Button>,
		);
		expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
	});

	it("renders with right icon", () => {
		render(
			<Button icon={ChevronRight} iconPlacement="right">
				Next
			</Button>,
		);
		expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
	});

	it("handles click events", async () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		await userEvent.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("can be disabled", () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("expands icon when using expandIcon effect", () => {
		render(
			<Button icon={ChevronRight} iconPlacement="right" effect="expandIcon">
				Expand
			</Button>,
		);
		const iconWrapper = screen.getByRole("button").querySelector("div");
		expect(iconWrapper).toHaveClass("w-0", "opacity-0");
	});
});
