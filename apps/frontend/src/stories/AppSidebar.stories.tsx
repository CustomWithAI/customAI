import type { Meta, StoryObj } from "@storybook/react";
import { AppSidebar } from "../components/app-sidebar";

const meta = {
	title: "Components/AppSidebar",
	component: AppSidebar,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		side: {
			control: "select",
			options: ["left", "right"],
			defaultValue: "left",
		},
		variant: {
			control: "select",
			options: ["sidebar", "floating", "inset"],
			defaultValue: "sidebar",
		},
		collapsible: {
			control: "select",
			options: ["offcanvas", "icon", "none"],
			defaultValue: "offcanvas",
		},
	},
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		side: "left",
		variant: "sidebar",
		collapsible: "offcanvas",
	},
};

export const Floating: Story = {
	args: {
		variant: "floating",
		collapsible: "icon",
	},
};

export const Inset: Story = {
	args: {
		variant: "inset",
		collapsible: "none",
	},
};
