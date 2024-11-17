"use client";

import { NavActions } from "@/components/nav-actions";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarProvider,
	SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { type SidebarPage, sidebarConfig } from "@/configs/sidebar";
import { cn } from "@/libs/utils";
import type * as React from "react";
import type { ComponentProps, ReactNode } from "react";

type AppNavbarProps = {
	activeTab: keyof typeof SidebarPage;
	disabledTab: keyof typeof SidebarPage | undefined;
	children: ReactNode;
	contentClassName?: string;
} & ComponentProps<typeof Sidebar>;

export const AppNavbar = ({
	activeTab,
	disabledTab,
	contentClassName,
	children,
	...props
}: AppNavbarProps) => {
	const navMainWithActive = sidebarConfig.navMain.map((item) => ({
		...item,
		isActive: item.title === activeTab,
	}));

	const navSecondaryWithActive = sidebarConfig.navSecondary.map((item) => ({
		...item,
		isActive: item.title === activeTab,
	}));
	return (
		<SidebarProvider>
			<Sidebar className="border-r-0" {...props}>
				<SidebarHeader>
					<TeamSwitcher teams={sidebarConfig.teams} />
					<NavMain items={navMainWithActive} />
				</SidebarHeader>
				<SidebarContent>
					<NavSecondary items={navSecondaryWithActive} className="mt-auto" />
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center gap-2">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage className="line-clamp-1">
										Project Management & Task Tracking
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="ml-auto px-3">
						<NavActions />
					</div>
				</header>
				<div
					className={cn(
						"flex flex-1 flex-col gap-4 px-8 py-10 w-full max-w-screen-2xl mx-auto",
						contentClassName,
					)}
				>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
