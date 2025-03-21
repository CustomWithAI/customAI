import { render, screen } from "@testing-library/react";
import { ActivityBox } from "../activityBox";

describe("ActivityBox", () => {
	const mockActivity = {
		title: "Test Activity",
		description: "Test Description",
		time: new Date(),
		status: "update" as const,
	};

	it("renders activity details", () => {
		render(<ActivityBox {...mockActivity} />);

		expect(screen.getByText(mockActivity.title)).toBeInTheDocument();
		expect(screen.getByText(mockActivity.description)).toBeInTheDocument();
		expect(screen.getByText(mockActivity.time.toString())).toBeInTheDocument();
	});

	it("renders with different activity types", () => {
		const activities = [
			{ ...mockActivity, time: new Date(), status: "create" as const },
			{ ...mockActivity, time: new Date(), status: "update" as const },
			{ ...mockActivity, time: new Date(), status: "delete" as const },
		];

		for (const activity of activities) {
			render(<ActivityBox {...activity} />);
			const box = screen.getByTestId("activity-box");
			expect(box).toHaveAttribute("data-type", activity.status);
		}
	});

	it("renders with default styles", () => {
		render(<ActivityBox {...mockActivity} />);

		const box = screen.getByTestId("activity-box");
		expect(box).toHaveClass(
			"flex items-center gap-4 rounded-lg border border-gray-200 bg-card p-4 text-card-foreground",
		);
	});
});
