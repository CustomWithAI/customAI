import {
	Blocks,
	Calendar,
	Command,
	Home,
	Inbox,
	MessageCircleQuestion,
	Search,
	Settings2,
	Sparkles,
	Trash2,
} from "lucide-react";

export enum SidebarPage {
	Search = "Search",
	AskAI = "Ask AI",
	Home = "Home",
	Inbox = "Inbox",
	Calendar = "Calendar",
	Settings = "Settings",
	Templates = "Templates",
	Trash = "Trash",
	Help = "Help",
}

export const sidebarConfig = {
	teams: [
		{
			name: "Custom AI",
			logo: Command,
			plan: "Enterprise",
		},
	],
	navMain: [
		{
			title: SidebarPage.Search,
			url: "#",
			icon: Search,
		},
		{
			title: SidebarPage.AskAI,
			url: "#",
			icon: Sparkles,
		},
		{
			title: SidebarPage.Home,
			url: "#",
			icon: Home,
		},
		{
			title: SidebarPage.Inbox,
			url: "#",
			icon: Inbox,
			badge: "10",
		},
	],
	navSecondary: [
		{
			title: SidebarPage.Calendar,
			url: "#",
			icon: Calendar,
		},
		{
			title: SidebarPage.Settings,
			url: "#",
			icon: Settings2,
		},
		{
			title: SidebarPage.Templates,
			url: "#",
			icon: Blocks,
		},
		{
			title: SidebarPage.Trash,
			url: "#",
			icon: Trash2,
		},
		{
			title: SidebarPage.Help,
			url: "#",
			icon: MessageCircleQuestion,
		},
	],
};
