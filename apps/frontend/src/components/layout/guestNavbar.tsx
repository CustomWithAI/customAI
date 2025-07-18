"use client";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useRouter } from "@/libs/i18nNavigation";
import { cn } from "@/libs/utils";
import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	forwardRef,
} from "react";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

export function GuestNavbar() {
	const router = useRouter();
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem
					onClick={() => router.push("/")}
					className="hover:cursor-pointer mr-9 font-medium"
				>
					CustomAI
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="font-light">
						Getting started
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-6 m-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<button
										type="button"
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-zinc-100 p-6 no-underline outline-hidden focus:shadow-md"
										onClick={() => router.push("/")}
									>
										<div className="mb-2 mt-4 text-lg font-medium">
											AI Platform
										</div>
										<p className="text-sm leading-tight text-zinc-400 font-light text-fo">
											Beautifully designed components that you can copy and
											paste into your apps. Accessible. Customizable. Open
											Source.
										</p>
									</button>
								</NavigationMenuLink>
							</li>
							<ListItem href="/docs" title="Introduction">
								Re-usable components built using Radix UI and Tailwind CSS.
							</ListItem>
							<ListItem href="/docs/installation" title="Installation">
								How to install dependencies and structure your app.
							</ListItem>
							<ListItem href="/docs/primitives/typography" title="Typography">
								Styles for headings, paragraphs, lists...etc
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<button type="button" onClick={() => router.push("/learning")}>
						<NavigationMenuLink
							className={cn(navigationMenuTriggerStyle(), "font-light")}
						>
							Learning
						</NavigationMenuLink>
					</button>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
	({ className, title, children, href, ...props }, ref) => {
		return (
			<li>
				<NavigationMenuLink asChild>
					<Link
						href={href || "/"}
						ref={ref}
						className={cn(
							"block select-none space-y-1 hover:bg-muted rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
							className,
						)}
						{...props}
					>
						<div className="text-sm font-medium leading-none">{title}</div>
						<p className="line-clamp-2 text-sm leading-snug font-extralight text-muted-foreground">
							{children}
						</p>
					</Link>
				</NavigationMenuLink>
			</li>
		);
	},
);
ListItem.displayName = "ListItem";
