import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

const meta = {
	title: "UI/Alert",
	component: Alert,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<>
				<AlertTitle>Information</AlertTitle>
				<AlertDescription>This is a default alert message.</AlertDescription>
			</>
		),
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
		children: (
			<>
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					Something went wrong. Please try again later.
				</AlertDescription>
			</>
		),
	},
};

export const WithIcon: Story = {
	args: {
		children: (
			<>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-4 w-4"
				>
					<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
				<AlertTitle>Warning</AlertTitle>
				<AlertDescription>
					Your session is about to expire. Please save your work.
				</AlertDescription>
			</>
		),
	},
};
