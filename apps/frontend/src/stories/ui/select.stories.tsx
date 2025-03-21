import type { Meta, StoryObj } from "@storybook/react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../../components/ui/select";

const meta = {
	title: "UI/Select",
	component: Select,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a fruit" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Fruits</SelectLabel>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="orange">Orange</SelectItem>
						<SelectItem value="grape">Grape</SelectItem>
					</SelectGroup>
				</SelectContent>
			</>
		),
	},
};

export const WithGroups: Story = {
	args: {
		children: (
			<>
				<SelectTrigger className="w-[280px]">
					<SelectValue placeholder="Select a timezone" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>North America</SelectLabel>
						<SelectItem value="est">Eastern Time (ET)</SelectItem>
						<SelectItem value="cst">Central Time (CT)</SelectItem>
						<SelectItem value="mst">Mountain Time (MT)</SelectItem>
						<SelectItem value="pst">Pacific Time (PT)</SelectItem>
					</SelectGroup>
					<SelectGroup>
						<SelectLabel>Europe</SelectLabel>
						<SelectItem value="gmt">GMT</SelectItem>
						<SelectItem value="cet">Central European Time</SelectItem>
						<SelectItem value="eet">Eastern European Time</SelectItem>
					</SelectGroup>
				</SelectContent>
			</>
		),
	},
};

export const Disabled: Story = {
	args: {
		children: (
			<>
				<SelectTrigger className="w-[180px]" disabled>
					<SelectValue placeholder="Select an option" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="1">Option 1</SelectItem>
					<SelectItem value="2">Option 2</SelectItem>
					<SelectItem value="3">Option 3</SelectItem>
				</SelectContent>
			</>
		),
	},
};
