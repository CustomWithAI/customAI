"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/libs/utils";
import type { ReactNode } from "react";

type SizeProps = "sm" | "md" | "lg";
type TemplateProps = "avatar" | "line1" | "line2";

type BaseSkeletonProps = {
	loading?: boolean;
	children?: ReactNode;
	size?: SizeProps;
	template?: TemplateProps;
	className?: string;
};

const sizeMap: Record<SizeProps, Record<TemplateProps, string>> = {
	sm: {
		avatar: "h-8 w-8",
		line1: "h-3 w-[150px]",
		line2: "h-3 w-[100px]",
	},
	md: {
		avatar: "h-12 w-12",
		line1: "h-4 w-[250px]",
		line2: "h-4 w-[200px]",
	},
	lg: {
		avatar: "h-16 w-16",
		line1: "h-5 w-[350px]",
		line2: "h-5 w-[300px]",
	},
};

export const BaseSkeleton = ({
	loading = true,
	children,
	size = "md",
	template = "avatar",
	className,
}: BaseSkeletonProps) => {
	const sizes = sizeMap[size];
	if (loading) {
		return <Skeleton className={cn(sizes[template], className)} />;
	}
	return children;
};
