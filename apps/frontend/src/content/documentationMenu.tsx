import type { DocGroup } from "@/components/mdx/learningSidebar";
import { BookOpen, FileText, Home } from "lucide-react";

export const documentationNav: DocGroup[] = [
	{
		title: "Overview",
		icon: Home,
		pages: [{ title: "Learning Home", href: "/learning" }],
	},
	{
		title: "AI",
		icon: BookOpen,
		pages: [
			{ title: "Basic AI", href: "/learning/basic_ai" },
			{ title: "Data Preparation", href: "/learning/data-preparation" },
			{ title: "Preprocessing", href: "/learning/preprocessing" },
		],
	},
	{
		title: "Model",
		icon: FileText,
		pages: [
			{ title: "Training", href: "/learning/training" },
			{ title: "Evaluation", href: "/learning/evaluation" },
		],
	},
];
