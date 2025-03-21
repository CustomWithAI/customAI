import { useToast } from "@/hooks/use-toast";
import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "../../components/ui/toast";

const meta = {
	title: "UI/Toast",
	component: Toast,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[380px]">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastDemo = () => {
	const { toast } = useToast();

	return (
		<div className="space-y-2">
			<Button
				onClick={() =>
					toast({
						title: "Default Toast",
						description: "This is a default toast message",
					})
				}
			>
				Show Default Toast
			</Button>
			<Button
				variant="destructive"
				onClick={() =>
					toast({
						variant: "destructive",
						title: "Error Toast",
						description: "Something went wrong!",
					})
				}
			>
				Show Error Toast
			</Button>
		</div>
	);
};

export const Default: Story = {
	render: () => (
		<ToastProvider>
			<Toast>
				<div className="flex gap-3">
					<Info className="h-5 w-5" />
					<div className="grid gap-1">
						<ToastTitle>New Message</ToastTitle>
						<ToastDescription>
							You have a new message in your inbox.
						</ToastDescription>
					</div>
				</div>
				<ToastClose />
			</Toast>
			<ToastViewport />
		</ToastProvider>
	),
};

export const WithAction: Story = {
	render: () => (
		<ToastProvider>
			<Toast>
				<div className="flex gap-3">
					<CheckCircle2 className="h-5 w-5 text-green-500" />
					<div className="grid gap-1">
						<ToastTitle>Success!</ToastTitle>
						<ToastDescription>
							Your changes have been saved successfully.
						</ToastDescription>
					</div>
				</div>
				<ToastAction
					altText="Undo changes"
					className="bg-green-500 text-white hover:bg-green-600"
				>
					Undo
				</ToastAction>
				<ToastClose />
			</Toast>
			<ToastViewport />
		</ToastProvider>
	),
};

export const Destructive: Story = {
	render: () => (
		<ToastProvider>
			<Toast variant="destructive">
				<div className="flex gap-3">
					<XCircle className="h-5 w-5" />
					<div className="grid gap-1">
						<ToastTitle>Error</ToastTitle>
						<ToastDescription>
							Failed to save changes. Please try again.
						</ToastDescription>
					</div>
				</div>
				<ToastAction
					altText="Try again"
					className="border-white bg-white text-red-500 hover:bg-zinc-100"
				>
					Try Again
				</ToastAction>
				<ToastClose />
			</Toast>
			<ToastViewport />
		</ToastProvider>
	),
};

export const Warning: Story = {
	render: () => (
		<ToastProvider>
			<Toast>
				<div className="flex gap-3">
					<AlertCircle className="h-5 w-5 text-yellow-500" />
					<div className="grid gap-1">
						<ToastTitle>Warning</ToastTitle>
						<ToastDescription>
							Your session will expire in 5 minutes.
						</ToastDescription>
					</div>
				</div>
				<ToastAction
					altText="Extend session"
					className="bg-yellow-500 text-white hover:bg-yellow-600"
				>
					Extend
				</ToastAction>
				<ToastClose />
			</Toast>
			<ToastViewport />
		</ToastProvider>
	),
};

export const Interactive: Story = {
	render: () => (
		<ToastProvider>
			<ToastDemo />
			<ToastViewport />
		</ToastProvider>
	),
};
