import { render, screen } from "@testing-library/react";
import BaseLayout from "../baseLayout";

describe("BaseLayout", () => {
	it("renders children content", () => {
		render(
			<BaseLayout locale={""}>
				<div>Test Content</div>
			</BaseLayout>,
		);

		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	it("renders with default styles", () => {
		render(
			<BaseLayout locale={""}>
				<div>Content</div>
			</BaseLayout>,
		);

		const layout = screen.getByTestId("base-layout");
		expect(layout).toHaveClass("min-h-screen");
	});
});
