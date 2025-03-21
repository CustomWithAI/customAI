import { render, screen } from "@testing-library/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../card";

describe("Card", () => {
	it("renders card with basic content", () => {
		render(
			<Card>
				<div>Basic content</div>
			</Card>,
		);

		expect(screen.getByText("Basic content")).toBeInTheDocument();
	});

	it("renders card with all subcomponents", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
				<CardFooter>
					<p>Card Footer</p>
				</CardFooter>
			</Card>,
		);

		expect(screen.getByText("Card Title")).toBeInTheDocument();
		expect(screen.getByText("Card Description")).toBeInTheDocument();
		expect(screen.getByText("Card Content")).toBeInTheDocument();
		expect(screen.getByText("Card Footer")).toBeInTheDocument();
	});

	it("applies custom className to card components", () => {
		render(
			<Card className="custom-card" data-testid="card">
				<CardHeader className="custom-header" data-testid="header">
					<CardTitle className="custom-title" data-testid="title">
						Title
					</CardTitle>
					<CardDescription
						className="custom-description"
						data-testid="description"
					>
						Description
					</CardDescription>
				</CardHeader>
				<CardContent className="custom-content" data-testid="content">
					Content
				</CardContent>
				<CardFooter className="custom-footer" data-testid="footer">
					Footer
				</CardFooter>
			</Card>,
		);

		expect(screen.getByTestId("card")).toHaveClass("custom-card");
		expect(screen.getByTestId("header")).toHaveClass("custom-header");
		expect(screen.getByTestId("title")).toHaveClass("custom-title");
		expect(screen.getByTestId("description")).toHaveClass("custom-description");
		expect(screen.getByTestId("content")).toHaveClass("custom-content");
		expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
	});

	it("forwards ref to card component", () => {
		const ref = jest.fn();
		render(<Card ref={ref}>Card content</Card>);
		expect(ref).toHaveBeenCalled();
	});

	it("renders nested cards", () => {
		render(
			<Card>
				<CardHeader>
					<CardTitle>Parent Card</CardTitle>
				</CardHeader>
				<CardContent>
					<Card>
						<CardHeader>
							<CardTitle>Nested Card</CardTitle>
						</CardHeader>
						<CardContent>Nested Content</CardContent>
					</Card>
				</CardContent>
			</Card>,
		);

		expect(screen.getByText("Parent Card")).toBeInTheDocument();
		expect(screen.getByText("Nested Card")).toBeInTheDocument();
		expect(screen.getByText("Nested Content")).toBeInTheDocument();
	});
});
