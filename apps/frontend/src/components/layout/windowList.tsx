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

type WindowListProps<T extends object> = {
	className?: string;
	queryHook: () => UseInfiniteQueryResult<
		InfiniteData<ResponsePagination<T> | undefined>,
		Error
	>;
	direction: "horizontal" | "vertical";
	itemContent: (index: number, item: T) => ReactNode;
};

export const WindowList = <T extends object>({
	queryHook,
	className,
	direction = "vertical",
	itemContent,
}: WindowListProps<T>) => {
	const [isTop, setIsTop] = useState<boolean>(false);
	const [isBottom] = useState<boolean>(true);
	const windowRef = useRef<VirtuosoHandle>(null);
	const { width = 0, height = 0 } = useWindowSize();

	const { data, fetchNextPage, hasNextPage } = queryHook();

	const items =
		data?.pages?.flatMap((page) => page?.data).filter((i) => i !== undefined) ||
		[];

	const scrollRange = direction === "horizontal" ? width : height;

	return (
		<div
			className={cn("relative w-fit h-full", {
				"w-full h-fit": direction === "horizontal",
			})}
		>
			{isTop && (
				<button
					className="absolute  left-0 top-1/2 z-[99] -translate-y-1/2 flex justify-center items-center size-10 pt-0.5 pr-0.5 bg-white/60 duration-150 hover:bg-zinc-200 active:bg-zinc-400 rounded-full "
					onClick={() =>
						windowRef.current?.scrollBy({
							left: -scrollRange,
							top: -scrollRange,
							behavior: "smooth",
						})
					}
				>
					◀
				</button>
			)}
			{isBottom && (
				<button
					className="absolute right-0 top-1/2 z-[99] -translate-y-1/2 flex justify-center pt-0.5 pl-0.5 items-center size-10 bg-white/60 duration-150 active:bg-zinc-400 hover:bg-zinc-200  rounded-full"
					onClick={() =>
						windowRef.current?.scrollBy({
							left: scrollRange,
							top: scrollRange,
							behavior: "smooth",
						})
					}
				>
					▶
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
					{ "w-full h-[200px]": direction === "horizontal" },
					className,
				)}
				data={items || []}
				horizontalDirection={direction === "horizontal"}
				itemContent={itemContent}
				endReached={() => {
					if (hasNextPage) fetchNextPage();
				}}
			/>
		</div>
	);
};
