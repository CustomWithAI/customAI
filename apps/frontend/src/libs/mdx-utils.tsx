// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs from "fs";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";
import matter from "gray-matter";
import { calculateReadingTime } from "./read-time";
import { extractTocFromContent } from "./toc-utils";

export interface MDXFrontmatter {
	title: string;
	description: string;
	date?: string;
	author?: string;
	tags?: string[];
	status?: "draft" | "published";
	[key: string]: any;
}

export interface MDXPage {
	slug: string;
	frontmatter: MDXFrontmatter;
	content: string;
	readingTime: string;
	toc: any[];
}

export function getMDXData(filePath: string): MDXPage {
	const fileContents = fs.readFileSync(filePath, "utf8");

	const { data, content } = matter(fileContents);
	const slug = path.basename(filePath, path.extname(filePath));

	const { text: readingTime } = calculateReadingTime(content);
	const toc = extractTocFromContent(content);

	return {
		slug,
		frontmatter: data as MDXFrontmatter,
		content,
		readingTime,
		toc,
	};
}

export function getAllMDXData(directory: string): MDXPage[] {
	const files = fs.readdirSync(directory);

	return files
		.filter((file) => file.endsWith(".mdx"))
		.map((file) => {
			const filePath = path.join(directory, file);
			return getMDXData(filePath);
		})
		.sort((a, b) => {
			if (a.frontmatter.date && b.frontmatter.date) {
				return (
					new Date(b.frontmatter.date).getTime() -
					new Date(a.frontmatter.date).getTime()
				);
			}
			return a.frontmatter.title.localeCompare(b.frontmatter.title);
		});
}
