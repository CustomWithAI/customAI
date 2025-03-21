import { render, screen } from "@testing-library/react";
import {
	Content,
	ContentHeader,
	Italic,
	Primary,
	SubContent,
	SubHeader,
	Subtle,
	Tiny,
} from "../text";

describe("Content", () => {
	it("renders with default variant", () => {
		render(<Content>Default Text</Content>);
		const text = screen.getByText("Default Text");
		expect(text).toBeInTheDocument();
		expect(text).toHaveClass("text-base");
	});

	it("applies custom className", () => {
		render(<Content className="custom-class">Custom Text</Content>);
		expect(screen.getByText("Custom Text")).toHaveClass("custom-class");
	});
});

describe("Typography Components", () => {
	it("renders with different sizes", () => {
		render(
			<div>
				<Tiny>Extra Small</Tiny>
				<SubContent>Small</SubContent>
				<Content>Base</Content>
				<ContentHeader>Large</ContentHeader>
				<SubHeader>Extra Large</SubHeader>
			</div>,
		);

		expect(screen.getByText("Extra Small")).toHaveClass("text-[10px]");
		expect(screen.getByText("Small")).toHaveClass("text-sm");
		expect(screen.getByText("Base")).toHaveClass("text-base");
		expect(screen.getByText("Large")).toHaveClass("text-lg");
		expect(screen.getByText("Extra Large")).toHaveClass("text-2xl");
	});

	it("renders with different weights", () => {
		render(
			<div>
				<Subtle>Light</Subtle>
				<Content>Normal</Content>
				<SubContent>Medium</SubContent>
				<SubHeader>Semibold</SubHeader>
				<Primary>Bold</Primary>
			</div>,
		);

		expect(screen.getByText("Light")).toHaveClass("font-light");
		expect(screen.getByText("Normal")).toBeInTheDocument();
		expect(screen.getByText("Medium")).toHaveClass("font-medium");
		expect(screen.getByText("Semibold")).toHaveClass("font-semibold");
		expect(screen.getByText("Bold")).toHaveClass("font-bold");
	});

	it("renders with different colors", () => {
		render(
			<div>
				<Content>Primary</Content>
				<Subtle>Muted</Subtle>
				<Italic>Italic</Italic>
			</div>,
		);

		expect(screen.getByText("Primary")).toBeInTheDocument();
		expect(screen.getByText("Muted")).toHaveClass("text-gray-500");
		expect(screen.getByText("Italic")).toHaveClass("text-gray-500", "italic");
	});
});
