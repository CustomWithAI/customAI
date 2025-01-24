import * as React from "react";

import { cn } from "@/libs/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
					" file:text-zinc-950 placeholder:text-zinc-500 hover:border-black/40 focus-visible:outline-none focus-visible:shadow-sm",
					" focus-visible:border-yellow-800 disabled:cursor-not-allowed [&:invalid]:border-red-500 [&:invalid]:ring-red-500",
					"disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-100",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
