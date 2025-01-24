import {
	Blocks,
	Calendar,
	Command,
	Database,
	FileCog,
	Home,
	Inbox,
	MessageCircleQuestion,
	Search,
	Settings2,
	Sparkles,
	Trash2,
	Workflow,
} from "lucide-react";

export enum SidebarPage {
	Home = "navbar.home",
	Workflow = "navbar.workflow",
	Dataset = "navbar.dataset",
	Preset = "navbar.preset",
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
			title: SidebarPage.Home,
			url: "/home",
			icon: Home,
		},
		{
			title: SidebarPage.Dataset,
			url: "/dataset",
			icon: Database,
		},
		{
			title: SidebarPage.Workflow,
			url: "/workflow",
			icon: Workflow,
		},
		{
			title: SidebarPage.Preset,
			url: "#",
			icon: FileCog,
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
