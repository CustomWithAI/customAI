// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";
import { LearningSidebar } from "@/components/mdx/learningSidebar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { routing } from "@/i18n/routings";
import { Link } from "@/libs/i18nNavigation";
import { getAllMDXData } from "@/libs/mdx-utils";
import { getPrefixLang } from "@/utils/getPrefixLang";
import { CalendarDays, Clock } from "lucide-react";

export async function generateStaticParams() {
	const locales = routing.locales;
	const staticParams = [];

	for (const locale of locales) {
		const docsDirectory = path.join(
			process.cwd(),
			`src/content/learning/${getPrefixLang(locale)}`,
		);
		const allDocs = getAllMDXData(docsDirectory);

		const allTags = new Set<string>();
		for (const doc of allDocs) {
			if (!doc.frontmatter.tags) continue;
			for (const tag of doc.frontmatter.tags) allTags.add(tag);
		}

		const params = Array.from(allTags).map((tag) => ({
			locale,
			tag,
		}));

		staticParams.push(...params);
	}

	return staticParams;
}

export async function generateMetadata({
	params,
}: { params: { tag: string } }) {
	const { tag } = params;

	return {
		title: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Documentation`,
		description: `Browse all documentation related to ${tag}`,
	};
}

export default function TagPage({
	params,
}: { params: { tag: string; lang: string } }) {
	const { tag, lang } = params;
	const docsDirectory = path.join(
		process.cwd(),
		`src/content/learning/${getPrefixLang(lang)}`,
	);
	const allDocs = getAllMDXData(docsDirectory);

	const docsWithTag = allDocs.filter((doc) =>
		doc.frontmatter.tags?.includes(tag),
	);

	return (
		<div className="flex min-h-screen">
			{/* Navigation Sidebar */}
			<LearningSidebar />

			{/* Main content */}
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto px-4 py-12">
					<div className="max-w-4xl mx-auto">
						<div className="mb-12">
							<h1 className="text-4xl font-bold tracking-tight mb-4 capitalize">
								{tag} Documentation
							</h1>
							<p className="text-xl text-muted-foreground">
								Browse all documentation related to {tag}
							</p>
						</div>

						{/* Documents grid */}
						<div className="grid gap-6">
							{docsWithTag.map((doc) => (
								<Card key={doc.slug}>
									<CardHeader>
										<CardTitle>
											<Link
												href={`/docs/${doc.slug}`}
												className="hover:underline"
											>
												{doc.frontmatter.title}
											</Link>
										</CardTitle>
										<CardDescription>
											{doc.frontmatter.description}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
											{doc.frontmatter.date && (
												<div className="flex items-center gap-1">
													<CalendarDays className="h-4 w-4" />
													<span>
														{new Date(doc.frontmatter.date).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															},
														)}
													</span>
												</div>
											)}

											<div className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												<span>{doc.readingTime}</span>
											</div>

											{doc.frontmatter.author && (
												<div className="flex items-center gap-1">
													<span>By {doc.frontmatter.author}</span>
												</div>
											)}
										</div>
									</CardContent>
									<CardFooter>
										<Button asChild>
											<Link href={`/docs/${doc.slug}`}>Read More</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>

						{docsWithTag.length === 0 && (
							<div className="text-center py-12">
								<p className="text-muted-foreground">
									No documentation found for this tag.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
