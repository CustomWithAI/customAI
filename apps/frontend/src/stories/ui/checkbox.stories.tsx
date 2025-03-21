import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../../components/ui/checkbox";

const meta = {
	title: "UI/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "terms",
	},
	decorators: [
		(Story) => (
			<div className="flex items-center space-x-2">
				<Story />
				<label
					htmlFor="terms"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Accept terms and conditions
				</label>
			</div>
		),
	],
};

export const Disabled: Story = {
	args: {
		id: "disabled",
		disabled: true,
	},
	decorators: [
		(Story) => (
			<div className="flex items-center space-x-2">
				<Story />
				<label
					htmlFor="disabled"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Disabled option
				</label>
			</div>
		),
	],
};

export const CheckboxGroup: Story = {
	render: () => (
		<div className="grid gap-2">
			<div className="flex items-center space-x-2">
				<Checkbox id="option1" />
				<label htmlFor="option1" className="text-sm font-medium leading-none">
					Option 1
				</label>
			</div>
			<div className="flex items-center space-x-2">
				<Checkbox id="option2" defaultChecked />
				<label htmlFor="option2" className="text-sm font-medium leading-none">
					Option 2
				</label>
			</div>
			<div className="flex items-center space-x-2">
				<Checkbox id="option3" />
				<label htmlFor="option3" className="text-sm font-medium leading-none">
					Option 3
				</label>
			</div>
		</div>
	),
};
