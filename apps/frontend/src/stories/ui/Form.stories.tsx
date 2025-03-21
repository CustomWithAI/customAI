import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../components/ui/select";

const meta: Meta = {
	title: "UI/Form",
	component: Form,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[400px] p-4">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

const loginFormSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	rememberMe: z.boolean().default(false),
});

const LoginForm = () => {
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(console.log)} className="space-y-6">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Enter your email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Enter your password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="rememberMe"
					render={({ field }) => (
						<FormItem className="flex items-center space-x-2 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="text-sm font-normal">Remember me</FormLabel>
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					Sign In
				</Button>
			</form>
		</Form>
	);
};

const registrationFormSchema = z.object({
	username: z.string().min(2, "Username must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	role: z.string().min(1, "Please select a role"),
	bio: z.string().max(160, "Bio must not exceed 160 characters").optional(),
	notifications: z.boolean().default(true),
});

const RegistrationForm = () => {
	const form = useForm<z.infer<typeof registrationFormSchema>>({
		resolver: zodResolver(registrationFormSchema),
		defaultValues: {
			username: "",
			email: "",
			role: "",
			bio: "",
			notifications: true,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(console.log)} className="space-y-6">
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
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="admin">Administrator</SelectItem>
									<SelectItem value="user">Regular User</SelectItem>
									<SelectItem value="editor">Editor</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bio</FormLabel>
							<FormControl>
								<Input placeholder="Tell us about yourself" {...field} />
							</FormControl>
							<FormDescription>Maximum 160 characters.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="notifications"
					render={({ field }) => (
						<FormItem className="flex items-center space-x-2 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="text-sm font-normal">
								Receive notifications
							</FormLabel>
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					Register
				</Button>
			</form>
		</Form>
	);
};

export const LoginFormExample: Story = {
	args: {},
	render: () => <LoginForm />,
};

export const RegistrationFormExample: Story = {
	args: {},
	render: () => <RegistrationForm />,
};
