import { Badge } from "@/components/ui/badge";
import type { MDXFrontmatter } from "@/libs/mdx-utils";
import type { TableOfContentsItem } from "@/libs/toc-utils";
import { CalendarDays, Clock, Tag } from "lucide-react";
import type { ReactNode } from "react";
import { LearningNavigation } from "./LearningNavigation";
import { LearningSidebar } from "./learningSidebar";
import { TableOfContents } from "./tableOfContent";

interface LearningLayoutProps {
	children: ReactNode;
	title: string;
	description: string;
	metadata: MDXFrontmatter;
	toc: TableOfContentsItem[];
	readingTime: string;
	navigation?: {
		prev?: {
			title: string;
			href: string;
		};
		next?: {
			title: string;
			href: string;
		};
	};
}

export function LearningLayout({
	children,
	title,
	description,
	metadata,
	toc,
	readingTime,
	navigation,
}: LearningLayoutProps) {
	return (
		<div className="flex min-h-screen">
			{/* Navigation Sidebar */}
			<LearningSidebar />

			{/* Main content and TOC sidebar */}
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col lg:flex-row gap-12">
						<div className="flex-1">
							<div className="mb-8 pb-8 border-b">
								<h1 className="text-4xl font-bold tracking-tight mb-3">
									{title}
								</h1>
								<p className="text-xl text-muted-foreground mb-4">
									{description}
								</p>

								<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
									{metadata.date && (
										<div className="flex items-center gap-1">
											<CalendarDays className="h-4 w-4" />
											<span>
												{new Date(metadata.date).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</div>
									)}

									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4" />
										<span>{readingTime} read</span>
									</div>

									{metadata.author && (
										<div className="flex items-center gap-1">
											<span>By {metadata.author}</span>
										</div>
									)}
								</div>

								{metadata.tags && metadata.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mt-4">
										<Tag className="h-4 w-4 text-muted-foreground" />
										{metadata.tags.map((tag) => (
											<Badge key={tag} variant="secondary">
												{tag}
											</Badge>
										))}
									</div>
								)}
							</div>
							<article className="prose prose-slate dark:prose-invert max-w-none">
								{children}
							</article>
							{navigation && (
								<LearningNavigation
									prev={navigation.prev}
									next={navigation.next}
								/>
							)}
						</div>
						<div className="lg:w-64 order-first lg:order-last">
							<div className="sticky top-16">
								<TableOfContents toc={toc} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
