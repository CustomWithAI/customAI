import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../dialog";

describe("Dialog", () => {
	const setup = () => {
		render(
			<Dialog>
				<DialogTrigger asChild>
					<Button>Open Dialog</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
						<DialogDescription>This is a dialog description.</DialogDescription>
					</DialogHeader>
					<div className="py-4">Some content here</div>
					<DialogFooter>
						<Button>Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>,
		);
	};

	it("renders dialog trigger button", () => {
		setup();
		expect(
			screen.getByRole("button", { name: "Open Dialog" }),
		).toBeInTheDocument();
	});

	it("opens dialog when trigger is clicked", async () => {
		setup();
		const trigger = screen.getByRole("button", { name: "Open Dialog" });
		await userEvent.click(trigger);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("Dialog Title")).toBeInTheDocument();
		expect(
			screen.getByText("This is a dialog description."),
		).toBeInTheDocument();
	});

	it("renders dialog content with header and footer", async () => {
		setup();
		const trigger = screen.getByRole("button", { name: "Open Dialog" });
		await userEvent.click(trigger);

		expect(screen.getByText("Some content here")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Save changes" }),
		).toBeInTheDocument();
	});

	it("closes dialog when close button is clicked", async () => {
		setup();
		const trigger = screen.getByRole("button", { name: "Open Dialog" });
		await userEvent.click(trigger);

		const closeButton = screen.getByRole("button", { name: "Close" });
		await userEvent.click(closeButton);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("applies custom className to dialog components", async () => {
		render(
			<Dialog>
				<DialogTrigger asChild>
					<Button>Open Dialog</Button>
				</DialogTrigger>
				<DialogContent className="custom-content">
					<DialogHeader className="custom-header">
						<DialogTitle className="custom-title">Custom Dialog</DialogTitle>
						<DialogDescription className="custom-description">
							Custom description
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="custom-footer">
						<Button>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>,
		);

		const trigger = screen.getByRole("button", { name: "Open Dialog" });
		await userEvent.click(trigger);

		expect(screen.getByRole("dialog")).toHaveClass("custom-content");
		expect(screen.getByText("Custom Dialog")).toHaveClass("custom-title");
		expect(screen.getByText("Custom description")).toHaveClass(
			"custom-description",
		);
	});
});
