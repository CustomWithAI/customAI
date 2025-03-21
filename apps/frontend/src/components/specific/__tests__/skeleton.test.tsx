import { render, screen } from "@testing-library/react";
import { Skeleton } from "../skeleton";

describe("Skeleton", () => {
	it("renders with default props", () => {
		render(<Skeleton />);
		const skeleton = screen.getByTestId("skeleton");
		expect(skeleton).toBeInTheDocument();
		expect(skeleton).toHaveClass("animate-pulse rounded-md bg-muted");
	});

	it("applies custom className", () => {
		render(<Skeleton className="custom-skeleton" />);
		const skeleton = screen.getByTestId("skeleton");
		expect(skeleton).toHaveClass("custom-skeleton");
	});

	it("renders with custom dimensions", () => {
		render(<Skeleton width={200} height={100} />);
		const skeleton = screen.getByTestId("skeleton");
		expect(skeleton).toHaveStyle({
			width: "200px",
			height: "100px",
		});
	});

	it("renders with percentage dimensions", () => {
		render(<Skeleton width="50%" height="25%" />);
		const skeleton = screen.getByTestId("skeleton");
		expect(skeleton).toHaveStyle({
			width: "50%",
			height: "25%",
		});
	});

	it("renders with custom styles", () => {
		render(
			<Skeleton
				style={{
					backgroundColor: "red",
					margin: "10px",
				}}
			/>,
		);
		const skeleton = screen.getByTestId("skeleton");
		expect(skeleton).toHaveStyle({
			backgroundColor: "red",
			margin: "10px",
		});
	});
});
