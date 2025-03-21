import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../select";

// Mock functions that JSDOM doesn't support
beforeAll(() => {
	Element.prototype.scrollIntoView = jest.fn();
	Element.prototype.setPointerCapture = jest.fn();
	Element.prototype.releasePointerCapture = jest.fn();
	Element.prototype.hasPointerCapture = jest.fn();
});

describe("Select", () => {
	const setup = () => {
		render(
			<Select>
				<SelectTrigger>
					<SelectValue placeholder="Select a fruit" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
					<SelectItem value="orange">Orange</SelectItem>
				</SelectContent>
			</Select>,
		);
	};

	it("renders with placeholder", () => {
		setup();
		expect(screen.getByText("Select a fruit")).toBeInTheDocument();
	});

	it("opens content when clicked", async () => {
		setup();
		const trigger = screen.getByRole("combobox");
		await userEvent.click(trigger);

		// Wait for the content to be visible
		const content = await screen.findByRole("listbox");
		expect(content).toBeInTheDocument();

		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(3);
		expect(options[0]).toHaveTextContent("Apple");
		expect(options[1]).toHaveTextContent("Banana");
		expect(options[2]).toHaveTextContent("Orange");
	});

	it("selects an item when clicked", async () => {
		setup();
		const trigger = screen.getByRole("combobox");
		await userEvent.click(trigger);

		const option = await screen.findByRole("option", { name: "Banana" });
		await userEvent.click(option);

		expect(trigger).toHaveTextContent("Banana");
	});

	it("can be disabled", () => {
		render(
			<Select disabled>
				<SelectTrigger>
					<SelectValue placeholder="Disabled select" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="option">Option</SelectItem>
				</SelectContent>
			</Select>,
		);

		const trigger = screen.getByRole("combobox");
		expect(trigger).toBeDisabled();
	});

	it("displays selected value", async () => {
		render(
			<Select defaultValue="banana">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="apple">Apple</SelectItem>
					<SelectItem value="banana">Banana</SelectItem>
					<SelectItem value="orange">Orange</SelectItem>
				</SelectContent>
			</Select>,
		);

		expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
	});
});
