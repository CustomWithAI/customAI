import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Callout } from "./components/ui/callout";
import { Separator } from "./components/ui/separator";

export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return useMemo(() => {
		return {
			// Override default elements with styled versions
			h1: ({ children }) => (
				<h1
					className="mt-8 mb-4 text-4xl text-zinc-800 font-bold tracking-tight"
					id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
				>
					{children}
				</h1>
			),
			h2: ({ children }) => (
				<h2
					className="mt-8 mb-3 text-3xl text-zinc-800 font-semibold tracking-tight"
					id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
				>
					{children}
				</h2>
			),
			h3: ({ children }) => (
				<h3
					className="mt-6 mb-2 text-2xl text-zinc-800 font-semibold tracking-tight"
					id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
				>
					{children}
				</h3>
			),
			p: ({ children }) => <p className="leading-7 mb-4">{children}</p>,
			a: ({ href, children }) => (
				<Link
					href={href || "#"}
					className="font-medium text-primary underline underline-offset-4"
				>
					{children}
				</Link>
			),
			hr: () => <hr className="border-gray-200" />,
			ul: ({ children }) => <ul className="my-6 ml-6 list-disc">{children}</ul>,
			ol: ({ children }) => (
				<ol className="my-6 ml-6 list-decimal">{children}</ol>
			),
			li: ({ children }) => <li className="mt-2">{children}</li>,
			blockquote: ({ children }) => (
				<blockquote className="mt-6 border-l-2 border-gray-200 pl-6 italic">
					{children}
				</blockquote>
			),
			img: (props) => (
				<img
					alt={props.alt || ""}
					src={props.src || ""}
					loading="lazy"
					className="rounded-md border my-6 w-2/3"
				/>
			),
			code: ({ children }) => (
				<code className="relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
					{children}
				</code>
			),
			pre: ({ children }) => (
				<pre className="mb-4 mt-4 overflow-x-auto rounded-lg border bg-black p-4 text-white">
					{children}
				</pre>
			),
			Callout,
			Separator,
			...components,
		};
	}, [components]);
}
