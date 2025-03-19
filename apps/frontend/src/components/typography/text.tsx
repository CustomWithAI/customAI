import { cn } from "@/libs/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import type React from "react";
import { type ReactNode, useState } from "react";

export interface TextProps {
	children: React.ReactNode;
	className?: string;
}

export type ListProps = Omit<TextProps, "children"> & {
	childrenList: ReactNode[];
};

export const Primary = ({ children, className }: TextProps) => {
	return (
		<h1
			className={cn(
				"text-4xl line font-bold scroll-m-20 lg:text-5xl tracking-tight",
				className,
			)}
		>
			{children}
		</h1>
	);
};

export const Header = ({ children, className }: TextProps) => {
	return (
		<h1 className={cn("text-3xl font-semibold scroll-m-20", className)}>
			{children}
		</h1>
	);
};

export const SubHeader = ({ children, className }: TextProps) => {
	return (
		<h2 className={cn("text-2xl font-semibold scroll-m-20", className)}>
			{children}
		</h2>
	);
};
export const ContentHeader = ({ children, className }: TextProps) => {
	return (
		<h3 className={cn("text-lg font-medium scroll-m-16", className)}>
			{children}
		</h3>
	);
};
export const Content = ({ children, className }: TextProps) => {
	return <p className={cn("text-base", className)}>{children}</p>;
};

export const SubContent = ({ children, className }: TextProps) => {
	return <p className={cn("text-sm font-medium", className)}>{children}</p>;
};

export const Subtle = ({ children, className }: TextProps) => {
	return (
		<p className={cn("text-sm font-light text-gray-500", className)}>
			{children}
		</p>
	);
};

export const Tiny = ({ children, className }: TextProps) => {
	return (
		<p className={cn("text-[10px] font-light text-gray-500", className)}>
			{children}
		</p>
	);
};

export const Italic = ({ children, className }: TextProps) => {
	return (
		<p className={cn("text-sm italic font-light text-gray-500", className)}>
			{children}
		</p>
	);
};

export const Quote = ({ children, className }: TextProps) => {
	return (
		<blockquote
			className={cn(
				"border-l-4 border-gray-300 pl-4 italic text-gray-700",
				className,
			)}
		>
			{children}
		</blockquote>
	);
};

export const List = ({ childrenList, className }: ListProps) => {
	return (
		<ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
			{childrenList.map((child, index) => (
				<li key={`list${index}${child?.valueOf()}`}>{child}</li>
			))}
		</ul>
	);
};

export const CodeBlock = ({ children, className }: TextProps) => {
	return (
		<pre
			className={cn(
				"bg-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto",
				className,
			)}
		>
			<code>{children}</code>
		</pre>
	);
};

export const Lead = ({ children, className }: TextProps) => {
	return (
		<p className={cn("text-lg font-medium text-gray-700", className)}>
			{children}
		</p>
	);
};

export const PreDataBlock = ({
	children,
	className,
	priority,
}: TextProps & { priority: string | null }) => {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<div className="space-y-4">
			<button
				onClick={() => setOpen((n) => !n)}
				type="button"
				className="hover:bg-zinc-50 border px-3 py-2 -my-2 rounded flex gap-x-3"
			>
				<Subtle>{priority || "data"}</Subtle>

				<ChevronDown
					className={cn("size-4 mt-0.5 transition-transform duration-150", {
						"rotate-180 ": open,
					})}
				/>
			</button>
			{open && (
				<pre
					className={cn(
						"bg-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto",
						className,
					)}
				>
					<code>{children}</code>
				</pre>
			)}
		</div>
	);
};
