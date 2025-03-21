import type { Meta, StoryObj } from "@storybook/react";
import { Calendar, Home, Search, Settings2, Sparkles } from "lucide-react";
import { NavMain } from "../components/nav-main";

// Mock the next-intl useTranslations hook
jest.mock("next-intl", () => ({
	useTranslations: () => (key: string) => key,
}));

const meta = {
	title: "Components/NavMain",
	component: NavMain,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-64 bg-sidebar p-4">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof NavMain>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
	{
		title: "Home",
		url: "/",
		icon: Home,
		isActive: true,
	},
	{
		title: "Search",
		url: "/search",
		icon: Search,
		items: [
			{
				title: "Recent",
				url: "/search/recent",
				isActive: false,
			},
			{
				title: "Saved",
				url: "/search/saved",
				isActive: false,
			},
		],
	},
	{
		title: "Ask AI",
		url: "/ask",
		icon: Sparkles,
	},
];

const extendedItems = [
	...defaultItems,
	{
		title: "Calendar",
		url: "/calendar",
		icon: Calendar,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings2,
		items: [
			{
				title: "Profile",
				url: "/settings/profile",
			},
			{
				title: "Preferences",
				url: "/settings/preferences",
				isActive: true,
			},
		],
	},
];

export const Default: Story = {
	args: {
		items: defaultItems,
	},
};

export const WithSubmenus: Story = {
	args: {
		items: extendedItems,
	},
};
