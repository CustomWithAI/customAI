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
import { getAllMDXData } from "@/libs/mdx-utils";
import {
	ArrowRight,
	BookOpen,
	Code,
	Compass,
	FileText,
	Lightbulb,
	Rocket,
} from "lucide-react";
import Link from "next/link";

// Documentation categories with icons
const categoryIcons: Record<string, any> = {
	"Getting Started": Rocket,
	"Core Concepts": Lightbulb,
	Guides: Compass,
	"API Reference": Code,
	Examples: FileText,
	Resources: BookOpen,
};

export default function DocsLandingPage() {
	const docsDirectory = path.join(process.cwd(), "/src/content/docs");
	const allDocs = getAllMDXData(docsDirectory);

	const docsByTag: Record<string, typeof allDocs> = {};

	for (const doc of allDocs) {
		if (doc.frontmatter.tags) {
			for (const tag of doc.frontmatter.tags) {
				if (!docsByTag[tag]) {
					docsByTag[tag] = [];
				}
				docsByTag[tag].push(doc);
			}
		}
	}

	const featuredDocs = allDocs.filter(
		(doc) =>
			doc.frontmatter.tags?.includes("basics") ||
			doc.frontmatter.tags?.includes("introduction"),
	);

	return (
		<div className="flex min-h-screen">
			{/* Navigation Sidebar */}
			<LearningSidebar />

			{/* Main content */}
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto px-4 py-12">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-12">
							<h1 className="text-4xl font-bold tracking-tight mb-4">
								Documentation
							</h1>
							<p className="text-xl text-muted-foreground">
								Everything you need to know about our platform. Browse the
								documentation, follow guides, and find resources to help you
								build with our tools.
							</p>
						</div>

						{/* Featured docs section */}
						{featuredDocs.length > 0 && (
							<div className="mb-12 bg-accent/50 rounded-lg p-6">
								<div className="flex items-start gap-4">
									<div className="bg-primary text-primary-foreground p-3 rounded-lg">
										<Rocket className="h-6 w-6" />
									</div>
									<div>
										<h2 className="text-2xl font-bold mb-2">Getting Started</h2>
										<p className="text-muted-foreground mb-4">
											Learn the basics and get up and running quickly.
										</p>
										<div className="flex flex-wrap gap-3">
											{featuredDocs.map((doc) => (
												<Button key={doc.slug} variant="outline" asChild>
													<Link href={`/docs/${doc.slug}`}>
														{doc.frontmatter.title}
													</Link>
												</Button>
											))}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Documentation by tags */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{Object.entries(docsByTag).map(([tag, docs]) => {
								if (tag === "basics" || tag === "introduction") return null;

								const Icon = categoryIcons[tag] || FileText;

								return (
									<Card key={tag}>
										<CardHeader>
											<div className="flex items-center gap-2 mb-2">
												<Icon className="h-5 w-5 text-primary" />
												<CardTitle className="capitalize">{tag}</CardTitle>
											</div>
											<CardDescription>
												{tag === "setup"
													? "Set up and configure your environment"
													: `Documentation related to ${tag}`}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2">
												{docs.slice(0, 3).map((doc) => (
													<li key={doc.slug}>
														<Link
															href={`/docs/${doc.slug}`}
															className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
														>
															<ArrowRight className="h-3 w-3" />
															{doc.frontmatter.title}
														</Link>
													</li>
												))}
											</ul>
										</CardContent>
										{docs.length > 3 && (
											<CardFooter>
												<Button variant="ghost" size="sm" asChild>
													<Link
														href={`/docs/tags/${tag}`}
														className="flex items-center gap-1"
													>
														View all ({docs.length}){" "}
														<ArrowRight className="h-4 w-4" />
													</Link>
												</Button>
											</CardFooter>
										)}
									</Card>
								);
							})}
						</div>

						{/* Additional resources section */}
						<div className="mt-16 border-t pt-12">
							<h2 className="text-2xl font-bold mb-6">Need more help?</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Card>
									<CardHeader>
										<CardTitle>Community Forum</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground">
											Join our community forum to ask questions and connect with
											other users.
										</p>
									</CardContent>
									<CardFooter>
										<Button variant="outline" asChild>
											<Link href="/community">Visit Forum</Link>
										</Button>
									</CardFooter>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>GitHub</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground">
											Check out our GitHub repositories for code examples and
											open source projects.
										</p>
									</CardContent>
									<CardFooter>
										<Button variant="outline" asChild>
											<a
												href="https://github.com/your-org"
												target="_blank"
												rel="noopener noreferrer"
											>
												View GitHub
											</a>
										</Button>
									</CardFooter>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Support</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground">
											Need direct assistance? Our support team is ready to help.
										</p>
									</CardContent>
									<CardFooter>
										<Button variant="outline" asChild>
											<Link href="/support">Contact Support</Link>
										</Button>
									</CardFooter>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
