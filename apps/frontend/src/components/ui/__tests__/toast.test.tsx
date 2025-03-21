import { useToast } from "@/hooks/use-toast";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "../toast";

// Mock the TOAST_REMOVE_DELAY to be shorter for tests
jest.mock("@/hooks/use-toast", () => {
	const actual = jest.requireActual("@/hooks/use-toast");
	return {
		...actual,
		TOAST_REMOVE_DELAY: 100,
	};
});

const TestToast = () => (
	<ToastProvider>
		<Toast>
			<ToastTitle>Test Title</ToastTitle>
			<ToastDescription>Test Description</ToastDescription>
			<ToastAction altText="test">Action</ToastAction>
			<ToastClose />
		</Toast>
		<ToastViewport />
	</ToastProvider>
);

const ToastTester = () => {
	const { toast } = useToast();

	return (
		<button
			onClick={() =>
				toast({
					title: "Dynamic Toast",
					description: "Dynamic Description",
					duration: 5000,
				})
			}
		>
			Show Toast
		</button>
	);
};

describe("Toast", () => {
	it("renders toast with all parts", () => {
		render(<TestToast />);

		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByText("Test Description")).toBeInTheDocument();
		expect(screen.getByText("Action")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(
			<ToastProvider>
				<Toast className="custom-class">
					<ToastTitle>Title</ToastTitle>
				</Toast>
				<ToastViewport />
			</ToastProvider>,
		);

		expect(screen.getByRole("status")).toHaveClass("custom-class");
	});

	it("creates dynamic toast using useToast hook", async () => {
		render(
			<ToastProvider>
				<ToastTester />
				<ToastViewport />
			</ToastProvider>,
		);

		fireEvent.click(screen.getByText("Show Toast"));

		await waitFor(() => {
			expect(screen.getByText("Dynamic Toast")).toBeInTheDocument();
			expect(screen.getByText("Dynamic Description")).toBeInTheDocument();
		});
	});

	it("calls onOpenChange when closed", async () => {
		const onOpenChange = jest.fn();

		render(
			<ToastProvider>
				<Toast onOpenChange={onOpenChange}>
					<ToastTitle>Title</ToastTitle>
					<ToastClose />
				</Toast>
				<ToastViewport />
			</ToastProvider>,
		);

		fireEvent.click(screen.getByRole("button", { name: /close/i }));

		await waitFor(() => {
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});
	});

	it("positions toast viewport correctly", () => {
		render(
			<ToastProvider>
				<Toast>
					<ToastTitle>Title</ToastTitle>
				</Toast>
				<ToastViewport className="custom-viewport" />
			</ToastProvider>,
		);

		expect(screen.getByRole("region")).toHaveClass("custom-viewport");
	});
});
