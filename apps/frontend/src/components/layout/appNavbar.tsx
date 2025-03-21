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
import { memo, useMemo } from "react";

type AppNavbarProps = {
	activeTab: keyof typeof SidebarPage;
	disabledTab: keyof typeof SidebarPage | undefined;
	children: ReactNode;
	contentClassName?: string;
	PageTitle: string | null;
} & ComponentProps<typeof Sidebar>;

export const AppNavbar = memo(
	({
		activeTab,
		disabledTab,
		contentClassName,
		children,
		PageTitle,
		...props
	}: AppNavbarProps) => {
		const navMainWithActive = useMemo(
			() =>
				sidebarConfig.navMain.map((item) => ({
					...item,
					isActive: String(item.title) === activeTab,
				})),
			[activeTab],
		);

		const navSecondaryWithActive = useMemo(
			() =>
				sidebarConfig.navSecondary.map((item) => ({
					...item,
					isActive: String(item.title) === activeTab,
				})),
			[activeTab],
		);
		return (
			<SidebarProvider>
				<Sidebar className="border-r-0 border-gray-200" {...props}>
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
											{PageTitle}
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<div
						className={cn(
							"flex flex-1 flex-col gap-4 px-8 py-10 w-full max-w-full 2xl:max-w-(--breakpoint-2xl) mx-auto",
							contentClassName,
						)}
					>
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		);
	},
);
