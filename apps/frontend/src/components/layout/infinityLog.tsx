"use client";

import { Button } from "@/components/ui/button";
import type { ResponsePagination } from "@/types/common";
import type { ResponseLog } from "@/types/logs";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LogEntryItem } from "./../common/logEntry";
import { LogDateSeparator } from "./../common/logSeparator";
import { env } from "@/env.mjs";

interface LogListProps<TData extends ResponseLog> {
	queryHook: UseInfiniteQueryResult<
		InfiniteData<ResponsePagination<TData> | undefined>,
		Error
	>;
	trainingId: string;
	className?: string;
}

export function InfiniteLog<TData extends ResponseLog>({
	queryHook,
	trainingId,
	className,
}: LogListProps<TData>) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = queryHook;

	const [realtimeLogs, setRealtimeLogs] = useState<TData[]>([]);
	const logContainerRef = useRef<HTMLDivElement>(null);
	const [isAtBottom, setIsAtBottom] = useState(true);

	useEffect(() => {
		const ws = new WebSocket(
			`${env.NEXT_PUBLIC_BACKEND_URL.replace(/^http/, "ws")}/ws/logs/${trainingId}`,
		);

		ws.onmessage = (event) => {
			try {
				const newLog = {
					id: `realtime-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
					createdAt: new Date().toISOString(),
					trainingId,
					data: event.data,
				} as TData;
				setRealtimeLogs((prev) => [...prev, newLog]);
				if (isAtBottom && logContainerRef.current) {
					setTimeout(() => {
						if (logContainerRef.current) {
							logContainerRef.current.scrollTop =
								logContainerRef.current.scrollHeight;
						}
					}, 0);
				}
			} catch (e) {
				console.error("Failed to parse WebSocket message:", e);
			}
		};

		ws.onclose = () => {
			console.log("WebSocket connection closed");
		};

		return () => {
			ws.close();
		};
	}, [trainingId, isAtBottom]);

	const handleScroll = () => {
		if (logContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
			const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
			setIsAtBottom(atBottom);
		}
	};

	const handleScrollToTop = () => {
		if (logContainerRef.current) {
			const { scrollTop } = logContainerRef.current;
			if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
				const currentScrollHeight = logContainerRef.current.scrollHeight;
				fetchNextPage().then(() => {
					setTimeout(() => {
						if (logContainerRef.current) {
							const newScrollHeight = logContainerRef.current.scrollHeight;
							logContainerRef.current.scrollTop =
								newScrollHeight - currentScrollHeight;
						}
					}, 0);
				});
			}
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const logContainer = logContainerRef.current;
		if (logContainer) {
			logContainer.addEventListener("scroll", handleScroll);
			logContainer.addEventListener("scroll", handleScrollToTop);

			return () => {
				logContainer.removeEventListener("scroll", handleScroll);
				logContainer.removeEventListener("scroll", handleScrollToTop);
			};
		}
	}, [hasNextPage, isFetchingNextPage]);

	const groupLogsByDate = () => {
		const allLogs: TData[] = [];
		if (data) {
			const reversedPages = [...data.pages].reverse();

			for (const page of reversedPages) {
				if (page) {
					allLogs.push(...page.data.reverse());
				}
			}
		}

		allLogs.push(...realtimeLogs);

		const groupedLogs: Record<string, TData[]> = {};

		for (const log of allLogs) {
			const date = new Date(log.createdAt).toDateString();
			if (!groupedLogs[date]) {
				groupedLogs[date] = [];
			}
			groupedLogs[date].push(log);
		}

		return groupedLogs;
	};

	const groupedLogs = groupLogsByDate();
	const dates = Object.keys(groupedLogs).sort();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800 dark:bg-red-950/50 dark:border-red-900 dark:text-red-300">
				<p>Error loading logs: {error.message}</p>
				<Button
					variant="outline"
					className="mt-2"
					onClick={() => queryHook.refetch()}
				>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className={className}>
			{isFetchingNextPage && (
				<div className="flex justify-center py-2">
					<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
				</div>
			)}
			<div
				ref={logContainerRef}
				className="h-[600px] overflow-y-auto border rounded-md bg-background p-4"
				onScroll={handleScroll}
			>
				{dates.length === 0 ? (
					<div className="flex justify-center items-center h-full text-muted-foreground">
						No logs available
					</div>
				) : (
					dates.map((date) => (
						<div key={date}>
							<LogDateSeparator date={date} />
							{groupedLogs[date].map((log) => (
								<LogEntryItem key={log.id} log={log} />
							))}
						</div>
					))
				)}

				{hasNextPage && (
					<div className="text-center text-xs text-muted-foreground py-2">
						Scroll to top to load more logs
					</div>
				)}
			</div>

			{!isAtBottom && (
				<Button
					variant="outline"
					size="sm"
					className="mt-2 mx-auto block"
					onClick={() => {
						if (logContainerRef.current) {
							logContainerRef.current.scrollTop =
								logContainerRef.current.scrollHeight;
						}
					}}
				>
					Jump to latest logs
				</Button>
			)}
		</div>
	);
}
