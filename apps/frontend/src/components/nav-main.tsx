"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "@/libs/i18nNavigation";
import { useTranslations } from "next-intl";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./ui/collapsible";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		isActive?: boolean;
		items?: { title: string; isActive?: boolean; url: string }[];
	}[];
}) {
	const t = useTranslations();
	return (
		<SidebarMenu>
			{items.map((item) => (
				<Collapsible
					key={item.title}
					asChild
					defaultOpen={item.isActive}
					className="group/collapsible"
				>
					<SidebarMenuItem key={item.title}>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton asChild isActive={item.isActive}>
								<Link href={item.url}>
									<item.icon />
									<span>{t(item.title as any)}</span>
									{item.items?.length && (
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									)}
								</Link>
							</SidebarMenuButton>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{item.items?.map((subItem) => (
									<SidebarMenuSubItem key={subItem.title}>
										<SidebarMenuSubButton asChild isActive={subItem.isActive}>
											<Link href={subItem.url}>
												<span>{t(subItem.title as any)}</span>
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					</SidebarMenuItem>
				</Collapsible>
			))}
		</SidebarMenu>
	);
}
