// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs from "fs";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";
import { routing } from "@/i18n/routings";
import { getPrefixLang } from "@/utils/getPrefixLang";
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
	locale: string;
}

export function getMDXData(filePath: string, locale: string): MDXPage {
	const fileContents = fs.readFileSync(filePath, "utf8");

	const { data, content } = matter(fileContents);
	const slug = path.basename(filePath, path.extname(filePath));

	const { text: readingTime } = calculateReadingTime(content);
	const toc = extractTocFromContent(content);
	console.log(data);

	return {
		slug,
		frontmatter: data as MDXFrontmatter,
		content,
		readingTime,
		toc,
		locale,
	};
}

export function getAllMDXData(locale: string): MDXPage[] {
	const directory = path.join(
		process.cwd(),
		`src/content/learning/${getPrefixLang(locale)}`,
	);

	if (!fs.existsSync(directory) && locale !== routing.defaultLocale) {
		return getAllMDXData(routing.defaultLocale).map((page) => ({
			...page,
			locale: routing.defaultLocale,
		}));
	}

	if (!fs.existsSync(directory)) {
		return [];
	}

	const files = fs.readdirSync(directory);

	return files
		.filter((file) => file.endsWith(".mdx"))
		.map((file) => {
			const filePath = path.join(directory, file);
			return getMDXData(filePath, locale);
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

export function getMDXDataBySlug(slug: string, locale: string): MDXPage | null {
	let filePath = path.join(process.cwd(), `src/content/learning/${slug}.mdx`);

	if (!fs.existsSync(filePath) && locale !== routing.defaultLocale) {
		filePath = path.join(
			process.cwd(),
			`src/content/learning/${getPrefixLang(locale)}/${slug}.mdx`,
		);

		if (!fs.existsSync(filePath)) {
			return null;
		}

		return {
			...getMDXData(filePath, routing.defaultLocale),
			locale: routing.defaultLocale,
		};
	}

	if (fs.existsSync(filePath)) {
		return getMDXData(filePath, locale);
	}

	return null;
}

export function getAllSlugs(): string[] {
	const slugs = new Set<string>();

	for (const locale of routing.locales) {
		const directory = path.join(
			process.cwd(),
			`src/content/learning/${getPrefixLang(locale)}`,
		);

		if (fs.existsSync(directory)) {
			const files = fs
				.readdirSync(directory)
				.filter((file) => file.endsWith(".mdx"));
			for (const file of files) {
				slugs.add(path.basename(file, path.extname(file)));
			}
		}
	}

	return Array.from(slugs);
}

export function getAllTags(locale: string): string[] {
	const tags = new Set<string>();

	const allDocs = getAllMDXData(locale);

	for (const doc of allDocs) {
		if (!doc.frontmatter.tags) continue;
		for (const tag of doc.frontmatter.tags) {
			tags.add(tag);
		}
	}

	return Array.from(tags);
}
