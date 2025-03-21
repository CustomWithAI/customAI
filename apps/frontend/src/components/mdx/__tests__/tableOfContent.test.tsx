import type { TableOfContentsItem } from "@/libs/toc-utils";
import { render, screen } from "@testing-library/react";
import { TableOfContents } from "../tableOfContent";

describe("TableOfContent", () => {
	const mockHeadings: TableOfContentsItem[] = [
		{ url: "section-1", title: "Section 1", level: 2 },
		{ url: "section-2", title: "Section 2", level: 2 },
		{ url: "subsection-1", title: "Subsection 1", level: 3 },
	];

	it("renders table of contents with headings", () => {
		render(<TableOfContents toc={mockHeadings} />);

		expect(screen.getByText("Section 1")).toBeInTheDocument();
		expect(screen.getByText("Section 2")).toBeInTheDocument();
		expect(screen.getByText("Subsection 1")).toBeInTheDocument();
	});

	it("renders links with correct href attributes", () => {
		render(<TableOfContents toc={mockHeadings} />);

		const links = screen.getAllByRole("link");
		expect(links[0]).toHaveAttribute("href", "#section-1");
		expect(links[1]).toHaveAttribute("href", "#section-2");
		expect(links[2]).toHaveAttribute("href", "#subsection-1");
	});

	it("applies correct indentation based on heading level", () => {
		render(<TableOfContents toc={mockHeadings} />);

		const links = screen.getAllByRole("link");
		expect(links[0].parentElement).toHaveStyle({ paddingLeft: "0px" });
		expect(links[1].parentElement).toHaveStyle({ paddingLeft: "0px" });
		expect(links[2].parentElement).toHaveStyle({ paddingLeft: "12px" });
	});

	it("renders with custom className", () => {
		render(<TableOfContents toc={mockHeadings} className="custom-toc" />);

		const toc = screen.getByRole("navigation");
		expect(toc).toHaveClass("custom-toc");
	});

	it("renders empty state when no headings provided", () => {
		render(<TableOfContents toc={[]} />);

		const toc = screen.getByRole("navigation");
		expect(toc).toBeEmptyDOMElement();
	});
});
