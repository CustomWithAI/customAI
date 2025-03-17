import type { DocGroup } from "@/components/mdx/learningSidebar";
import { BookOpen, FileText, Home } from "lucide-react";

export const documentationNav: DocGroup[] = [
	{
		title: "Overview",
		icon: Home,
		pages: [{ title: "Learning Home", href: "/learning" }],
	},
	{
		title: "Getting Started",
		icon: BookOpen,
		pages: [
			{ title: "Introduction", href: "/learning/getting-started" },
			{ title: "Installation", href: "/learning/installation" },
			{ title: "Configuration", href: "/learning/configuration" },
		],
	},
	{
		title: "Usage",
		icon: FileText,
		pages: [
			{ title: "Basic Usage", href: "/learning/usage" },
			{ title: "Advanced Features", href: "/learning/advanced-features" },
			{ title: "API Reference", href: "/learning/api-reference" },
		],
	},
	{
		title: "Examples",
		pages: [
			{ title: "Simple Example", href: "/learning/simple-example" },
			{ title: "Complex Example", href: "/learning/complex-example" },
			{ title: "Case Studies", href: "/learning/case-studies" },
		],
	},
];
