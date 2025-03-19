// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs from "fs";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";
import { LearningLayout } from "@/components/mdx/learningLayout";
import { routing } from "@/i18n/routings";
import { getMDXData } from "@/libs/mdx-utils";
import { useMDXComponents } from "@/mdx-components";
import { getPrefixLang } from "@/utils/getPrefixLang";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";

const docsNavigation = {
	"getting-started": {
		prev: undefined,
		next: { title: "Installation", href: "/learning/installation" },
	},
	installation: {
		prev: { title: "Getting Started", href: "/learning/getting-started" },
		next: { title: "Configuration", href: "/learning/configuration" },
	},
	configuration: {
		prev: { title: "Installation", href: "/learning/installation" },
		next: { title: "Usage", href: "/learning/usage" },
	},
	usage: {
		prev: { title: "Configuration", href: "/learning/configuration" },
		next: undefined,
	},
};

export async function generateStaticParams() {
	const locales = routing.locales;
	const staticParams = [];

	for (const locale of locales) {
		const docsDirectory = path.join(
			process.cwd(),
			`src/content/learning/${getPrefixLang(locale)}`,
		);
		const filenames = fs.readdirSync(docsDirectory);

		const params = filenames
			.filter((filename) => filename.endsWith(".mdx"))
			.map((filename) => ({
				locale,
				slug: filename.replace(/\.mdx$/, ""),
			}));

		staticParams.push(...params);
	}

	return staticParams;
}

export async function generateMetadata({
	params,
}: { params: { slug: string; locale: string } }) {
	const { slug, locale } = params;
	let filePath = path.join(
		process.cwd(),
		`src/content/learning/${getPrefixLang(locale)}`,
		`${slug}.mdx`,
	);
	if (!fs.existsSync(filePath)) {
		filePath = path.join(
			process.cwd(),
			`src/content/learning/${getPrefixLang(routing.defaultLocale)}`,
			`${slug}.mdx`,
		);
	}
	const { frontmatter } = getMDXData(filePath, locale);

	return {
		title: frontmatter.title,
		description: frontmatter.description,
	};
}

export default async function DocPage({
	params,
}: { params: { slug: string; locale: string } }) {
	const { slug, locale } = params;
	setRequestLocale(locale);
	console.log("params:", params);
	let filePath = path.join(
		process.cwd(),
		`src/content/learning/${getPrefixLang(locale)}`,
		`${slug}.mdx`,
	);
	if (!fs.existsSync(filePath)) {
		filePath = path.join(
			process.cwd(),
			`src/content/learning/${getPrefixLang(routing.defaultLocale)}`,
			`${slug}.mdx`,
		);
	}
	const { frontmatter, readingTime, toc, content } = getMDXData(
		filePath,
		locale,
	);

	const components = useMDXComponents();

	const navigation = docsNavigation[slug as keyof typeof docsNavigation];

	return (
		<LearningLayout
			title={frontmatter.title}
			description={frontmatter.description}
			metadata={frontmatter}
			toc={toc}
			readingTime={readingTime}
			navigation={navigation}
		>
			<MDXRemote source={content} components={components} />
		</LearningLayout>
	);
}
