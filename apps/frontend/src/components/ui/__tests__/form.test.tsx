import { render, screen } from "@/test/test-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../form";
import { Input } from "../input";

const formSchema = z.object({
	username: z.string().min(2, "Username must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
});

const TestForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(() => {})}>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Enter username" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Enter email" {...field} />
							</FormControl>
							<FormDescription>Enter your email address.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<button type="submit">Submit</button>
			</form>
		</Form>
	);
};

describe("Form", () => {
	it("renders form fields with labels and descriptions", () => {
		render(<TestForm />);

		expect(screen.getByLabelText("Username")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(
			screen.getByText("This is your public display name."),
		).toBeInTheDocument();
		expect(screen.getByText("Enter your email address.")).toBeInTheDocument();
	});

	it("shows validation errors for invalid input", async () => {
		render(<TestForm />);

		const submitButton = screen.getByText("Submit");
		await userEvent.click(submitButton);

		// Wait for the error message with the asterisk prefix
		const errorMessage = await screen.findByText((content, element) => {
			return element?.textContent === "*Username must be at least 2 characters";
		});
		expect(errorMessage).toBeInTheDocument();
	});

	it("shows email validation error for invalid email", async () => {
		render(<TestForm />);

		const emailInput = screen.getByLabelText("Email");
		await userEvent.type(emailInput, "invalid-email");

		const submitButton = screen.getByText("Submit");
		await userEvent.click(submitButton);

		// Wait for the error message with the asterisk prefix
		const errorMessage = await screen.findByText((content, element) => {
			return element?.textContent === "*Invalid email address";
		});
		expect(errorMessage).toBeInTheDocument();
	});

	it("accepts valid input", async () => {
		render(<TestForm />);

		const usernameInput = screen.getByLabelText("Username");
		const emailInput = screen.getByLabelText("Email");

		await userEvent.type(usernameInput, "johndoe");
		await userEvent.type(emailInput, "john@example.com");

		const submitButton = screen.getByText("Submit");
		await userEvent.click(submitButton);

		// Use queryByText with a custom matcher to check for error messages
		const usernameError = screen.queryByText((content, element) => {
			return element?.textContent === "*Username must be at least 2 characters";
		});
		const emailError = screen.queryByText((content, element) => {
			return element?.textContent === "*Invalid email address";
		});

		expect(usernameError).not.toBeInTheDocument();
		expect(emailError).not.toBeInTheDocument();
	});

	it("applies error styles to form label when validation fails", async () => {
		render(<TestForm />);

		const submitButton = screen.getByText("Submit");
		await userEvent.click(submitButton);

		const usernameLabel = screen.getByText("Username");
		expect(usernameLabel).toHaveClass("text-destructive");
	});

	it("renders form description with correct styling", () => {
		render(<TestForm />);

		const description = screen.getByText("This is your public display name.");
		expect(description).toHaveClass("text-sm", "text-muted-foreground");
	});

	it("renders form message with error styling", async () => {
		render(<TestForm />);

		const submitButton = screen.getByText("Submit");
		await userEvent.click(submitButton);

		// Wait for the error message with the asterisk prefix
		const errorMessage = await screen.findByText((content, element) => {
			return element?.textContent === "*Username must be at least 2 characters";
		});
		expect(errorMessage).toHaveClass("text-xs", "text-red-400");
	});
});
