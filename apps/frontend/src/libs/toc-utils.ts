export interface TableOfContentsItem {
	title: string;
	url: string;
	items?: TableOfContentsItem[];
	level: number;
}

export function extractTocFromContent(content: string): TableOfContentsItem[] {
	const headingRegex = /^(#+)\s+(.+)$/gm;
	const matches = Array.from(content.matchAll(headingRegex));

	const items: TableOfContentsItem[] = [];

	for (const match of matches) {
		const level = match[1].length;
		const title = match[2].trim();
		const url = `#${title
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]/g, "")}`;

		if (level > 1 && level < 4) {
			items.push({
				title,
				url,
				level,
				items: [],
			});
		}
	}

	return items;
}
