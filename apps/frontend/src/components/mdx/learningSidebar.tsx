"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/libs/utils";
import { BookOpen, ChevronRight, FileText, Home, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DocGroup {
	title: string;
	icon?: React.ElementType;
	pages: {
		title: string;
		href: string;
	}[];
}

const documentationNav: DocGroup[] = [
	{
		title: "Overview",
		icon: Home,
		pages: [{ title: "Documentation Home", href: "/docs" }],
	},
	{
		title: "Getting Started",
		icon: BookOpen,
		pages: [
			{ title: "Introduction", href: "/docs/getting-started" },
			{ title: "Installation", href: "/docs/installation" },
			{ title: "Configuration", href: "/docs/configuration" },
		],
	},
	{
		title: "Usage",
		icon: FileText,
		pages: [
			{ title: "Basic Usage", href: "/docs/usage" },
			{ title: "Advanced Features", href: "/docs/advanced-features" },
			{ title: "API Reference", href: "/docs/api-reference" },
		],
	},
	{
		title: "Examples",
		pages: [
			{ title: "Simple Example", href: "/docs/simple-example" },
			{ title: "Complex Example", href: "/docs/complex-example" },
			{ title: "Case Studies", href: "/docs/case-studies" },
		],
	},
];

interface LearningSidebarProps {
	className?: string;
}

export function LearningSidebar({ className }: LearningSidebarProps) {
	const pathname = usePathname();
	const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
		return documentationNav.reduce<Record<string, boolean>>((acc, group) => {
			acc[group.title] = group.pages.some((page) => page.href === pathname);
			return acc;
		}, {});
	});

	const toggleGroup = (title: string) => {
		setOpenGroups((prev) => ({
			...prev,
			[title]: !prev[title],
		}));
	};

	const sidebarContent = (
		<div className="pr-2 py-6">
			<div className="mb-4 px-4">
				<Link href="/docs" className="flex items-center gap-2">
					<BookOpen className="h-6 w-6 text-primary" />
					<h3 className="font-semibold text-lg">Documentation</h3>
				</Link>
			</div>
			<div className="space-y-1">
				{documentationNav.map((group) => (
					<Collapsible
						key={group.title}
						open={openGroups[group.title]}
						onOpenChange={() => toggleGroup(group.title)}
					>
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								className="w-full justify-between font-medium px-4"
							>
								<span className="flex items-center gap-2">
									{group.icon && (
										<group.icon className="h-4 w-4 text-muted-foreground" />
									)}
									{group.title}
								</span>
								<ChevronRight
									className={cn(
										"h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
										openGroups[group.title] ? "rotate-90" : "",
									)}
								/>
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="space-y-1 pl-6">
								{group.pages.map((page) => (
									<Link
										key={page.href}
										href={page.href}
										className={cn(
											"block py-1 px-2 rounded-md text-sm",
											pathname === page.href
												? "bg-accent text-accent-foreground font-medium"
												: "text-muted-foreground hover:text-foreground hover:bg-accent/50",
										)}
									>
										{page.title}
									</Link>
								))}
							</div>
						</CollapsibleContent>
					</Collapsible>
				))}
			</div>
		</div>
	);

	return (
		<>
			{/* Mobile sidebar trigger */}
			<div className="lg:hidden fixed z-20 top-4 left-4">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Open navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[260px] sm:w-[300px]">
						{sidebarContent}
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop sidebar */}
			<div
				className={cn(
					"hidden lg:block w-64 shrink-0 border-r h-screen sticky top-0 overflow-y-auto",
					className,
				)}
			>
				{sidebarContent}
			</div>
		</>
	);
}
