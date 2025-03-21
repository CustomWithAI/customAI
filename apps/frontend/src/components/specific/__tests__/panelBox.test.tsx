import { render, screen } from "@testing-library/react";
import { PanelBox } from "../panelBox";

describe("PanelBox", () => {
	it("renders children content", () => {
		render(
			<PanelBox>
				<div>Test Content</div>
			</PanelBox>,
		);

		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(
			<PanelBox className="custom-panel">
				<div>Content</div>
			</PanelBox>,
		);

		const panel = screen.getByTestId("panel-box");
		expect(panel).toHaveClass("custom-panel");
	});

	it("renders with default styles", () => {
		render(
			<PanelBox>
				<div>Content</div>
			</PanelBox>,
		);

		const panel = screen.getByTestId("panel-box");
		expect(panel).toHaveClass(
			"flex flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm",
		);
	});

	it("forwards ref correctly", () => {
		const ref = jest.fn();
		render(
			<PanelBox ref={ref}>
				<div>Content</div>
			</PanelBox>,
		);
		expect(ref).toHaveBeenCalled();
	});
});
