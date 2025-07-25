"use client";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/libs/utils";
import type { ResponsePagination } from "@/types/common";
import type {
	InfiniteData,
	UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { type ReactNode, useRef, useState } from "react";

import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";

/**
 * Props for the WindowList component with virtualized scrolling support.
 *
 * @template T - The shape of each item in the list.
 */
type WindowListProps<T extends object> = {
	/**
	 * Optional CSS class name for the list container.
	 */
	className?: string;

	/**
	 * Infinite query hook result, typically from useInfiniteQuery.
	 */
	query: UseInfiniteQueryResult<
		InfiniteData<ResponsePagination<T> | undefined>,
		Error
	>;

	/**
	 * Disable keyboard or button navigation if true.
	 * @default false
	 */
	noNavigation?: boolean;

	/**
	 * Scroll direction of the list.
	 * @default "vertical"
	 */
	direction: "horizontal" | "vertical";

	/**
	 * Render function for each item in the list.
	 *
	 * @param index - Index of the item.
	 * @param item - The current item.
	 * @param list - Full list of currently loaded items.
	 */
	itemContent: (index: number, item: T, list: T[]) => ReactNode;
};

export const WindowList = <T extends object>({
	query,
	className,
	noNavigation,
	direction = "vertical",
	itemContent,
}: WindowListProps<T>) => {
	const [isTop, setIsTop] = useState<boolean>(false);
	const windowRef = useRef<VirtuosoHandle>(null);
	const { width = 0, height = 0 } = useWindowSize();

	const { data, isPending, fetchNextPage, hasNextPage } = query;

	const items =
		data?.pages?.flatMap((page) => page?.data).filter((i) => i !== undefined) ||
		[];

	const scrollRange = direction === "horizontal" ? width : height;

	if (isPending) {
		return <></>;
	}

	return (
		<div
			className={cn("relative", {
				"w-full": direction === "horizontal",
				"h-full": direction === "vertical",
			})}
			style={{
				height: direction === "vertical" ? height * 0.7 : "auto",
			}}
		>
			{isTop && !noNavigation && (
				<button
					className={cn(
						"absolute z-[99] flex justify-center items-center size-10 pt-0.5 pr-0.5 bg-white/60 duration-150 hover:bg-zinc-200 active:bg-zinc-400 rounded-full",
						{
							"left-0 top-1/2 -translate-y-1/2": direction === "horizontal",
							"left-1/2 top-0 -translate-x-1/2": direction === "vertical",
						},
					)}
					onClick={() =>
						windowRef.current?.scrollBy({
							left: direction === "horizontal" ? -scrollRange : 0,
							top: direction === "horizontal" ? 0 : -scrollRange,
							behavior: "smooth",
						})
					}
				>
					{direction === "horizontal" ? "◀" : "▲"}
				</button>
			)}
			{!noNavigation && (
				<button
					className={cn(
						"absolute z-[99] flex justify-center items-center size-10 pt-0.5 pl-0.5 bg-white/60 duration-150 active:bg-zinc-400 hover:bg-zinc-200 rounded-full",
						{
							"right-0 top-1/2 -translate-y-1/2": direction === "horizontal",
							"left-1/2 bottom-0 -translate-x-1/2": direction === "vertical",
						},
					)}
					onClick={() =>
						windowRef.current?.scrollBy({
							left: direction === "horizontal" ? scrollRange : 0,
							top: direction === "horizontal" ? 0 : scrollRange,
							behavior: "smooth",
						})
					}
				>
					{direction === "horizontal" ? "▶" : "▼"}
				</button>
			)}
			<Virtuoso
				ref={windowRef}
				onScroll={() =>
					windowRef.current?.getState((state) => {
						setIsTop(scrollRange < state.scrollTop);
					})
				}
				className={cn(
					{ "w-full h-[15rem] overflow-x-hidden": direction === "horizontal" },
					{ "h-full w-auto": direction === "vertical" },
					className,
				)}
				data={items || []}
				horizontalDirection={direction === "horizontal"}
				itemContent={(index, data) => itemContent(index, data, items)}
				endReached={() => {
					if (hasNextPage) fetchNextPage();
				}}
			/>
		</div>
	);
};
