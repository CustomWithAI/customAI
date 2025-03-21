import { render, screen } from "@testing-library/react";
import { OverviewBox } from "../panelBox";

describe("OverviewBox", () => {
	it("renders children content", () => {
		render(<OverviewBox title={"Test Content"} description={""} />);

		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	it("renders with default styles", () => {
		render(<OverviewBox title={"Test Content"} description={""} />);

		const panel = screen.getByTestId("panel-box");
		expect(panel).toHaveClass(
			"flex flex-col gap-4 rounded-lg border border-gray-200 bg-card p-6 text-card-foreground shadow-sm",
		);
	});
});
