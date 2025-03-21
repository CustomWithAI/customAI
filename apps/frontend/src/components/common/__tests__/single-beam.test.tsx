import { render, screen } from "@testing-library/react";
import { SingleBeam } from "../single-beam";

describe("SingleBeam", () => {
	it("renders with default props", () => {
		render(<SingleBeam path="" />);
		const beam = screen.getByTestId("single-beam");
		expect(beam).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<SingleBeam path="" className="custom-beam" />);
		const beam = screen.getByTestId("single-beam");
		expect(beam).toHaveClass("custom-beam");
	});

	it("renders with custom size", () => {
		render(<SingleBeam path="" width={200} height={100} />);
		const beam = screen.getByTestId("single-beam");
		expect(beam).toHaveAttribute("width", "200");
		expect(beam).toHaveAttribute("height", "100");
	});
});
