"use client";

import {
	AudioWaveform,
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
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

const data = {
	teams: [
		{
			name: "Custom AI",
			logo: Command,
			plan: "Enterprise",
		},
	],
	navMain: [
		{
			title: "Search",
			url: "#",
			icon: Search,
		},
		{
			title: "Ask AI",
			url: "#",
			icon: Sparkles,
		},
		{
			title: "Home",
			url: "#",
			icon: Home,
			isActive: true,
		},
		{
			title: "Inbox",
			url: "#",
			icon: Inbox,
			badge: "10",
		},
	],
	navSecondary: [
		{
			title: "Calendar",
			url: "#",
			icon: Calendar,
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
		},
		{
			title: "Templates",
			url: "#",
			icon: Blocks,
		},
		{
			title: "Trash",
			url: "#",
			icon: Trash2,
		},
		{
			title: "Help",
			url: "#",
			icon: MessageCircleQuestion,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar className="border-r-0 border-gray-200" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
				<NavMain items={data.navMain} />
			</SidebarHeader>
			<SidebarContent>
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
