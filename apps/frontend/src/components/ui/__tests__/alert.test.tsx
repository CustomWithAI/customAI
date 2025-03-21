import { render, screen } from "@testing-library/react";
import { Alert, AlertDescription, AlertTitle } from "../alert";

describe("Alert", () => {
	it("renders with default variant", () => {
		render(
			<Alert>
				<AlertTitle>Test Alert</AlertTitle>
				<AlertDescription>This is a test alert message.</AlertDescription>
			</Alert>,
		);

		expect(screen.getByRole("alert")).toHaveClass("bg-background");
		expect(screen.getByText("Test Alert")).toBeInTheDocument();
		expect(
			screen.getByText("This is a test alert message."),
		).toBeInTheDocument();
	});

	it("renders with destructive variant", () => {
		render(
			<Alert variant="destructive">
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>Something went wrong.</AlertDescription>
			</Alert>,
		);

		expect(screen.getByRole("alert")).toHaveClass("border-destructive/50");
		expect(screen.getByText("Error")).toBeInTheDocument();
		expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
	});

	it("applies custom className to Alert", () => {
		render(
			<Alert className="custom-class">
				<AlertTitle>Custom Alert</AlertTitle>
			</Alert>,
		);

		expect(screen.getByRole("alert")).toHaveClass("custom-class");
	});

	it("applies custom className to AlertTitle", () => {
		render(
			<Alert>
				<AlertTitle className="custom-title">Custom Title</AlertTitle>
			</Alert>,
		);

		expect(screen.getByText("Custom Title")).toHaveClass("custom-title");
	});

	it("applies custom className to AlertDescription", () => {
		render(
			<Alert>
				<AlertDescription className="custom-description">
					Custom description
				</AlertDescription>
			</Alert>,
		);

		expect(screen.getByText("Custom description")).toHaveClass(
			"custom-description",
		);
	});

	it("renders with custom content", () => {
		render(
			<Alert>
				<div data-testid="custom-content">Custom content</div>
			</Alert>,
		);

		expect(screen.getByTestId("custom-content")).toBeInTheDocument();
	});
});
