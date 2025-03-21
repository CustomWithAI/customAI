import type { Meta, StoryObj } from "@storybook/react";
import { NavActions } from "../components/nav-actions";

const meta = {
	title: "Navigation/NavActions",
	component: NavActions,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof NavActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithDarkTheme: Story = {
	args: {},
	parameters: {
		backgrounds: {
			default: "dark",
		},
		theme: "dark",
	},
};

export const Mobile: Story = {
	args: {},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};

export const Tablet: Story = {
	args: {},
	parameters: {
		viewport: {
			defaultViewport: "tablet",
		},
	},
};
