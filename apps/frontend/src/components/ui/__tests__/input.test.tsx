import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input", () => {
	it("renders with default props", () => {
		render(<Input placeholder="Enter text" />);
		expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
	});

	it("accepts different types", () => {
		render(<Input type="password" placeholder="Password" />);
		expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
			"type",
			"password",
		);
	});

	it("handles user input", async () => {
		render(<Input placeholder="Username" />);
		const input = screen.getByPlaceholderText("Username");
		await userEvent.type(input, "john.doe");
		expect(input).toHaveValue("john.doe");
	});

	it("can be disabled", () => {
		render(<Input disabled placeholder="Disabled input" />);
		expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled();
	});

	it("applies custom className", () => {
		render(<Input className="custom-class" placeholder="Custom input" />);
		expect(screen.getByPlaceholderText("Custom input")).toHaveClass(
			"custom-class",
		);
	});

	it("handles invalid state", () => {
		render(
			<Input
				required
				pattern="[A-Za-z]+"
				value="123"
				onChange={() => {}}
				placeholder="Letters only"
			/>,
		);
		const input = screen.getByPlaceholderText("Letters only");
		expect(input).toBeInvalid();
	});

	it("handles file input type", () => {
		const { container } = render(<Input type="file" accept=".jpg,.png" />);
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.type).toBe("file");
		expect(input.accept).toBe(".jpg,.png");
	});

	it("forwards ref correctly", () => {
		const ref = jest.fn();
		render(<Input ref={ref} placeholder="Ref test" />);
		expect(ref).toHaveBeenCalled();
	});
});
