import type { LucideIcon } from "lucide-react";
import type React from "react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { authClient } from "../libs/auth-client";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		badge?: React.ReactNode;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const t = useTranslations();
	const router = useRouter();
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => {
						const [href, onClick] =
							item.url === "/logout"
								? [
										"#",
										async () =>
											await authClient.signOut({
												fetchOptions: {
													onSuccess: () => router.push("/login"),
												},
											}),
									]
								: [item.url, undefined];
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<a href={href} onClick={onClick}>
										<item.icon />
										<span>{t(item.title as any)}</span>
									</a>
								</SidebarMenuButton>
								{item.badge && (
									<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
								)}
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
