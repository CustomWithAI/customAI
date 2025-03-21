import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../components/ui/input";

const meta = {
	title: "UI/Input",
	component: Input,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		type: "text",
		placeholder: "Enter text here",
	},
};

export const Disabled: Story = {
	args: {
		type: "text",
		placeholder: "Disabled input",
		disabled: true,
	},
};

export const WithLabel: Story = {
	args: {
		type: "email",
		placeholder: "Enter your email",
		id: "email",
	},
	decorators: [
		(Story) => (
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<label htmlFor="email">Email</label>
				<Story />
			</div>
		),
	],
};

export const File: Story = {
	args: {
		type: "file",
		accept: "image/*",
	},
};

export const Password: Story = {
	args: {
		type: "password",
		placeholder: "Enter password",
	},
};
