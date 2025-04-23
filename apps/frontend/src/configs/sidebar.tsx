import {
	Blocks,
	Calendar,
	Command,
	Database,
	FileCog,
	Home,
	ImagePlay,
	Inbox,
	LogOut,
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
	Tools = "navbar.tool",
	ImagePreprocessing = "navbar.image-preprocessing",
	DataAugmentation = "navbar.data-augmentation",
	Model = "navbar.model",
	FeatureConfig = "navbar.feature-config",
	Settings = "navbar.settings",
	Logout = "navbar.logout",
	Help = "navbar.help",
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
			items: [
				{
					title: SidebarPage.ImagePreprocessing,
					url: "/preprocessing",
				},
				{
					title: SidebarPage.DataAugmentation,
					url: "/augmentation",
				},
				{
					title: SidebarPage.Model,
					url: "/model",
				},
				{
					title: SidebarPage.FeatureConfig,
					url: "/featureconfig",
				},
			],
		},
		{
			title: SidebarPage.Tools,
			url: "/use",
			icon: ImagePlay,
		},
	],
	navSecondary: [
		{
			title: SidebarPage.Settings,
			url: "/settings",
			icon: Settings2,
		},
		{
			title: SidebarPage.Help,
			url: "#",
			icon: MessageCircleQuestion,
		},
		{
			title: SidebarPage.Logout,
			url: "/logout",
			icon: LogOut,
		},
	],
};
