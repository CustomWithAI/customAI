import { cn } from "@/libs/utils";
import type { ReactNode } from "react";
import { Badge } from "./badge";

type VariantProps = "success" | "warning" | "danger";
export const DotBadge = ({
	children,
	className,
	gradient = false,
	variant,
}: {
	className?: string;
	gradient?: boolean;
	children: ReactNode;
	variant: VariantProps;
}) => (
	<Badge
		variant="outline"
		className={cn(
			"relative pl-5 -py-[0.5px]",
			className,
			{
				"bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:from-orange-600 hover:via-red-600 hover:to-purple-700 transition-all":
					gradient,
			},
			{
				"border-amber-500 text-amber-500 bg-transparent border":
					variant === "warning",
			},
			{
				"border-green-500 text-green-500 bg-transparent border":
					variant === "success",
			},
			{
				"border-red-500 text-red-500 bg-transparent border":
					variant === "danger",
			},
		)}
	>
		<span
			className={cn(
				"absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white animate-pulse",
				{ "bg-amber-500": variant === "warning" },
				{ "bg-green-500": variant === "success" },
				{ "bg-red-500": variant === "danger" },
			)}
		/>
		{children}
	</Badge>
);
