"use client";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { type ElementType, useMemo } from "react";

export function TeamSwitcher({
	teams,
}: {
	teams: {
		name: string;
		logo: ElementType;
	}[];
}) {
	const activeTeam = useMemo(() => teams[0], [teams]);
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="inline-flex space-x-2 p-2 pt-2.5">
					<div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
						<activeTeam.logo className="size-3 mt-px" />
					</div>
					<span className="truncate font-semibold">{activeTeam.name}</span>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
