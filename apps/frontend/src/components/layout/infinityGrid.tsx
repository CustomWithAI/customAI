"use client";

import type {
	InfiniteData,
	InfiniteQueryObserverResult,
	UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";
import type { ResponsePagination } from "@/types/common";

export type InfiniteGridProps<TData extends object> = {
	/**
	 * Query result from useInfiniteQuery hook
	 */
	query: UseInfiniteQueryResult<
		InfiniteData<ResponsePagination<TData> | undefined>,
		Error
	>;
	/**
	 * Number of columns in the grid or "auto" for responsive auto-fit columns
	 * When using "auto", provide minItemWidth to control the minimum width of each item
	 * @default 3
	 */
	columns?:
		| number
		| { sm?: number; md?: number; lg?: number; xl?: number }
		| "auto";
	/**
	 * Minimum width of each item when using "auto" columns
	 * @default "250px"
	 */
	minItemWidth?: string;
	/**
	 * Gap between grid items
	 * @default "gap-4"
	 */
	gap?: string;
	/**
	 * Size of each item in the grid
	 * @default "h-auto"
	 */
	itemSize?: string;
	/**
	 * Scroll position percentage (0-100) at which to load the next page
	 * @default 80 (triggers at 80% of scroll)
	 */
	scrollTriggerAt?: number;
	className?: string;
	renderItem: (item: TData, index: number) => React.ReactNode;
	renderLoading?: () => React.ReactNode;
	renderError?: (error: Error) => React.ReactNode;
	renderEmpty?: () => React.ReactNode;
};

export function InfiniteGrid<TData extends object>({
	query,
	columns = 3,
	minItemWidth = "250px",
	gap = "gap-4",
	itemSize = "h-auto",
	scrollTriggerAt = 80,
	className,
	renderItem,
	renderLoading,
	renderError,
	renderEmpty,
}: InfiniteGridProps<TData>) {
	const { ref, inView } = useInView({
		rootMargin: `0px 0px ${100 - scrollTriggerAt}% 0px`,
		threshold: 0,
	});
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = query;

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

	const getGridCols = () => {
		if (columns === "auto") {
			return "";
		}

		if (typeof columns === "number") {
			return `grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 12)}`;
		}

		const { sm = 2, md = 3, lg = 4, xl = 5 } = columns;
		return `grid-cols-1 sm:grid-cols-${Math.min(sm, 12)} md:grid-cols-${Math.min(md, 12)} lg:grid-cols-${Math.min(lg, 12)} xl:grid-cols-${Math.min(xl, 12)}`;
	};

	const getGridStyle = () => {
		if (columns === "auto") {
			return {
				gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`,
			};
		}
		return {};
	};

	if (status === "pending") {
		return renderLoading ? (
			renderLoading()
		) : (
			<div className="flex justify-center items-center w-full py-12">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (status === "error") {
		return renderError ? (
			renderError(error as Error)
		) : (
			<div className="flex justify-center items-center w-full py-12">
				<p className="text-destructive">
					Error loading data: {(error as Error).message}
				</p>
			</div>
		);
	}

	const allItems = data?.pages.flatMap((page) => page?.data) || [];
	if (allItems.length === 0) {
		return renderEmpty ? (
			renderEmpty()
		) : (
			<div className="flex justify-center items-center w-full py-12">
				<p className="text-muted-foreground">No items found</p>
			</div>
		);
	}

	return (
		<div className={cn("w-full", className)}>
			<div className={cn("grid", getGridCols(), gap)} style={getGridStyle()}>
				{allItems.map((item, index) => (
					<div key={index} className={cn(itemSize)}>
						{item && renderItem(item, index)}
					</div>
				))}
			</div>

			<div ref={ref} className="flex justify-center items-center w-full py-4">
				{isFetchingNextPage && (
					<Loader2 className="h-6 w-6 animate-spin text-primary" />
				)}
			</div>
		</div>
	);
}
