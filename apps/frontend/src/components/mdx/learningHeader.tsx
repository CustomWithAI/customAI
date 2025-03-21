"use client";

import { Badge } from "@/components/ui/badge";
import type { MDXFrontmatter } from "@/libs/mdx-utils";
import { CalendarDays, Clock, TagIcon, User } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import Link from "next/link";

interface DocHeaderProps {
	title: string;
	description: string;
	metadata: MDXFrontmatter;
	readingTime: string;
	contentLocale?: string;
}

export function DocHeader({
	title,
	description,
	metadata,
	readingTime,
	contentLocale,
}: DocHeaderProps) {
	const locale = useLocale();
	const { relativeTime } = useFormatter();
	const t = useTranslations();

	return (
		<div className="mb-8 pb-6 border-b border-gray-200">
			<h1 className="text-4xl font-bold tracking-tight mb-3">{title}</h1>
			<p className="text-xl text-muted-foreground mb-6">{description}</p>

			<div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
				{metadata.date && (
					<div className="flex items-center gap-2">
						<CalendarDays className="h-4 w-4" />
						<span>{relativeTime(new Date(metadata.date || ""))}</span>
					</div>
				)}

				<div className="flex items-center gap-2">
					<Clock className="h-4 w-4" />
					<span>{readingTime}</span>
				</div>

				{metadata.author && (
					<div className="flex items-center gap-2">
						<User className="h-4 w-4" />
						<span>{metadata.author}</span>
					</div>
				)}
			</div>

			{metadata.tags && metadata.tags.length > 0 && (
				<div className="flex flex-wrap items-center gap-2 mt-4">
					<TagIcon className="h-4 w-4 text-muted-foreground" />
					{metadata.tags.map((tag) => (
						<Link href={`/${locale}/docs/tags/${tag}`} key={tag}>
							<Badge
								variant="secondary"
								className="capitalize hover:bg-secondary/80"
							>
								{tag}
							</Badge>
						</Link>
					))}
				</div>
			)}

			{Object.entries(metadata).map(([key, value]) => {
				if (["title", "description", "date", "author", "tags"].includes(key)) {
					return null;
				}

				if (
					typeof value === "function" ||
					(typeof value === "object" && value !== null && !Array.isArray(value))
				) {
					return null;
				}

				return (
					<div key={key} className="mt-2 text-sm">
						<span className="font-medium capitalize">{key}:</span>{" "}
						<span className="text-muted-foreground">
							{Array.isArray(value) ? value.join(", ") : String(value)}
						</span>
					</div>
				);
			})}

			{/* Show a notice if the content is in the fallback language */}
			{contentLocale && contentLocale !== locale && (
				<div className="mt-4 p-4 bg-muted rounded-md">
					<p className="text-sm text-muted-foreground">
						{t.rich("notices.fallbackLanguage", {
							language: () =>
								t(`languages.${contentLocale as "en-US" | "th-TH"}`),
						})}
					</p>
				</div>
			)}
		</div>
	);
}
