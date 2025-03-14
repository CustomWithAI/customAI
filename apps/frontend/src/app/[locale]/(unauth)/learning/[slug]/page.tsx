// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs from "fs";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";
import { LearningLayout } from "@/components/mdx/learningLayout";
import { getMDXData } from "@/libs/mdx-utils";
import { useMDXComponents } from "@/mdx-components";
import { MDXRemote } from "next-mdx-remote/rsc";

const docsNavigation = {
	"getting-started": {
		prev: undefined,
		next: { title: "Installation", href: "/docs/installation" },
	},
	installation: {
		prev: { title: "Getting Started", href: "/docs/getting-started" },
		next: { title: "Configuration", href: "/docs/configuration" },
	},
	configuration: {
		prev: { title: "Installation", href: "/docs/installation" },
		next: { title: "Usage", href: "/docs/usage" },
	},
	usage: {
		prev: { title: "Configuration", href: "/docs/configuration" },
		next: undefined,
	},
};

export async function generateStaticParams() {
	const docsDirectory = path.join(process.cwd(), "/src/content/docs");
	const filenames = fs.readdirSync(docsDirectory);

	return filenames
		.filter((filename) => filename.endsWith(".mdx"))
		.map((filename) => ({
			slug: filename.replace(/\.mdx$/, ""),
		}));
}

export async function generateMetadata({
	params,
}: { params: { slug: string } }) {
	const { slug } = params;
	const filePath = path.join(process.cwd(), "/src/content/docs", `${slug}.mdx`);
	const { frontmatter } = getMDXData(filePath);

	return {
		title: frontmatter.title,
		description: frontmatter.description,
	};
}

export default async function DocPage({
	params,
}: { params: { slug: string } }) {
	const { slug } = params;
	const filePath = path.join(process.cwd(), "/src/content/docs", `${slug}.mdx`);

	const { frontmatter, readingTime, toc, content } = getMDXData(filePath);

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
