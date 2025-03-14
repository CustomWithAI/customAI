"use client";

import type { TableOfContentsItem } from "@/libs/toc-utils";
import { cn } from "@/libs/utils";
import { useEffect, useState } from "react";

interface TocProps {
	toc: TableOfContentsItem[];
	className?: string;
}

export function TableOfContents({ toc, className }: TocProps) {
	const [activeHeading, setActiveHeading] = useState<string>("");

	useEffect(() => {
		const headingElements = document.querySelectorAll("h2, h3");

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveHeading(entry.target.id);
					}
				}
			},
			{ rootMargin: "0px 0px -80% 0px" },
		);
		for (const element of Array.from(headingElements)) {
			observer.observe(element);
		}

		return () => {
			for (const element of Array.from(headingElements)) {
				observer.unobserve(element);
			}
		};
	}, []);

	return (
		<div className={cn("w-full", className)}>
			<h4 className="mb-4 text-sm font-semibold">On This Page</h4>
			<ul className="space-y-2 text-sm">
				{toc.map((item) => (
					<li key={item.url}>
						<a
							href={item.url}
							className={cn(
								"block text-muted-foreground hover:text-foreground",
								item.level === 2 ? "pl-0" : "pl-4",
								activeHeading === item.url.slice(1) &&
									"font-medium text-foreground",
							)}
						>
							{item.title}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
