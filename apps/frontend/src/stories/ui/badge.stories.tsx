import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../components/ui/badge";

const meta = {
	title: "UI/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Badge",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Secondary",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
		children: "Destructive",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "Outline",
	},
};

export const WithIcon: Story = {
	args: {
		children: (
			<>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mr-1"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M12 16v-4" />
					<path d="M12 8h.01" />
				</svg>
				New
			</>
		),
	},
};

export const StatusBadges: Story = {
	render: () => (
		<div className="flex gap-2">
			<Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
				Pending
			</Badge>
			<Badge variant="secondary" className="bg-green-200 text-green-800">
				Completed
			</Badge>
			<Badge variant="secondary" className="bg-red-200 text-red-800">
				Failed
			</Badge>
		</div>
	),
};
