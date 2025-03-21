import { render, screen } from "@testing-library/react";
import { ActivityBox } from "../activityBox";

describe("ActivityBox", () => {
	const mockActivity = {
		title: "Test Activity",
		description: "Test Description",
		date: "2024-03-20",
		type: "update" as const,
	};

	it("renders activity details", () => {
		render(<ActivityBox activity={mockActivity} />);

		expect(screen.getByText(mockActivity.title)).toBeInTheDocument();
		expect(screen.getByText(mockActivity.description)).toBeInTheDocument();
		expect(screen.getByText(mockActivity.date)).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<ActivityBox activity={mockActivity} className="custom-activity" />);

		const box = screen.getByTestId("activity-box");
		expect(box).toHaveClass("custom-activity");
	});

	it("renders with different activity types", () => {
		const activities = [
			{ ...mockActivity, type: "create" as const },
			{ ...mockActivity, type: "update" as const },
			{ ...mockActivity, type: "delete" as const },
		];

		for (const activity of activities) {
			render(<ActivityBox activity={activity} />);
			const box = screen.getByTestId("activity-box");
			expect(box).toHaveAttribute("data-type", activity.type);
		}
	});

	it("renders with default styles", () => {
		render(<ActivityBox activity={mockActivity} />);

		const box = screen.getByTestId("activity-box");
		expect(box).toHaveClass(
			"flex items-center gap-4 rounded-lg border border-gray-200 bg-card p-4 text-card-foreground",
		);
	});
});
