"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/libs/utils";

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
		error?: boolean;
	}
>(({ className, value, error, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn(
			"relative h-4 w-full overflow-hidden rounded-full bg-secondary dark:bg-zinc-800",
			className,
		)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className={cn(
				"h-full w-full flex-1 bg-primary transition-all dark:bg-zinc-50",
				{
					"bg-red-500 dark:bg-red-500": error,
				},
			)}
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
