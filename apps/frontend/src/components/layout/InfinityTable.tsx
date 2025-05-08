"use client";

import type {
	InfiniteData,
	UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Settings2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";
import type { ResponsePagination } from "@/types/common";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Column definition types
export type ColumnType =
	| "default"
	| "bold"
	| "italic"
	| "muted"
	| "numeric"
	| "status";

export type ColumnDef<TData extends object> = {
	header: string;
	accessorKey: keyof TData;
	type?: ColumnType;
	href?: (item: TData) => string | null;
	cell?: (item: TData) => React.ReactNode;
	className?: string;
	enableSorting?: boolean;
};

export type InfiniteTableProps<TData extends object> = {
	/**
	 * Query result from useInfiniteQuery hook
	 */
	query: UseInfiniteQueryResult<
		InfiniteData<ResponsePagination<TData> | undefined>,
		Error
	>;
	/**
	 * Column definitions
	 */
	columns: ColumnDef<TData>[];
	/**
	 * Key field for unique row identification
	 */
	keyField: keyof TData;
	/**
	 * Scroll position percentage (0-100) at which to load the next page
	 * @default 80 (triggers at 80% of scroll)
	 */
	scrollTriggerAt?: number;
	/**
	 * Enable column visibility controls
	 * @default true
	 */
	enableColumnVisibility?: boolean;
	/**
	 * Whether to show a border around the table
	 * @default true
	 */
	bordered?: boolean;
	/**
	 * Whether to make the table take up the full width of its container
	 * @default true
	 */
	fullWidth?: boolean;
	/**
	 * Whether to add zebra striping to the table rows
	 * @default false
	 */
	striped?: boolean;
	/**
	 * Whether rows should be clickable
	 * @default false
	 */
	clickableRows?: boolean;
	/**
	 * Additional class name to add to the table
	 */
	className?: string;
	/**
	 * Custom renderers
	 */
	renderLoading?: () => React.ReactNode;
	renderError?: (error: Error) => React.ReactNode;
	renderEmpty?: () => React.ReactNode;
	/**
	 * Header customization
	 */
	headerClassName?: string;
	cellClassName?: string;
	/**
	 * Custom row click handler - if provided, will override href generation
	 */
	onRowClick?: (item: TData) => void;
	/**
	 * Column styling overrides by name
	 */
	columnStyles?: Array<{
		column: string;
		type: ColumnType;
	}>;
};

export function InfiniteTable<TData extends object>({
	query,
	columns,
	keyField,
	scrollTriggerAt = 80,
	enableColumnVisibility = true,
	bordered = true,
	fullWidth = true,
	striped = false,
	clickableRows = false,
	className,
	renderLoading,
	renderError,
	renderEmpty,
	headerClassName,
	cellClassName,
	onRowClick,
	columnStyles = [],
}: InfiniteTableProps<TData>) {
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

	// Store which columns are visible
	const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
		() => {
			const initialVisibility: Record<string, boolean> = {};
			for (const column of columns) {
				initialVisibility[column.accessorKey.toString()] = true;
			}
			return initialVisibility;
		},
	);

	const columnsWithStyles = columns.map((column) => {
		const customStyle = columnStyles.find(
			(cs) => cs.column === column.accessorKey.toString(),
		);

		if (customStyle) {
			return {
				...column,
				type: customStyle.type,
			};
		}

		return column;
	});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

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

	const getCellClassNameByType = (
		type?: ColumnType,
		additionalClass?: string,
	) => {
		switch (type) {
			case "bold":
				return cn("font-bold", additionalClass);
			case "italic":
				return cn("italic", additionalClass);
			case "muted":
				return cn("text-muted-foreground", additionalClass);
			case "numeric":
				return cn("text-right tabular-nums", additionalClass);
			case "status":
				return cn("font-medium", additionalClass);
			default:
				return additionalClass || "";
		}
	};

	const renderCell = (item: TData, column: ColumnDef<TData>) => {
		if (column.cell) {
			return column.cell(item);
		}

		const accessorKey = column.accessorKey.toString();
		const value = accessorKey
			.split(".")
			.reduce((obj, key) => obj?.[key as keyof typeof obj], item as any);

		return value;
	};

	return (
		<div className={cn("w-full", className)}>
			{enableColumnVisibility && (
				<div className="flex justify-end mb-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="ml-auto">
								<Settings2 className="h-4 w-4 mr-2" />
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{columnsWithStyles.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.accessorKey.toString()}
									checked={visibleColumns[column.accessorKey.toString()]}
									onCheckedChange={(checked) =>
										setVisibleColumns((prev) => ({
											...prev,
											[column.accessorKey.toString()]: checked,
										}))
									}
								>
									{visibleColumns[column.accessorKey.toString()] ? (
										<Eye className="h-4 w-4 mr-2" />
									) : (
										<EyeOff className="h-4 w-4 mr-2" />
									)}
									{column.header}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}

			<div className={cn("rounded-md", bordered && "border border-gray-200")}>
				<div className="w-full overflow-auto">
					<Table className={cn(!fullWidth && "w-auto")}>
						<TableHeader>
							<TableRow>
								{columnsWithStyles.map((column) =>
									visibleColumns[column.accessorKey.toString()] ? (
										<TableHead
											key={column.accessorKey.toString()}
											className={cn(
												getCellClassNameByType(column.type),
												column.className,
												headerClassName,
											)}
										>
											{column.header}
										</TableHead>
									) : null,
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{allItems.map((item, rowIndex) => {
								if (!item) return;
								const rowKey = item[keyField]
									? String(item[keyField])
									: rowIndex;

								const rowHref =
									clickableRows && !onRowClick
										? columnsWithStyles.find((col) => col.href)?.href?.(item) ||
											"#"
										: undefined;

								const handleRowClick =
									clickableRows && onRowClick
										? () => onRowClick(item)
										: undefined;

								return (
									<TableRow
										key={rowKey}
										className={cn(
											clickableRows && "cursor-pointer hover:bg-muted/50",
											striped && rowIndex % 2 === 1 && "bg-muted/50",
										)}
										onClick={handleRowClick}
									>
										{columnsWithStyles.map((column) =>
											visibleColumns[column.accessorKey.toString()] ? (
												<TableCell
													key={`${rowKey}-${String(column.accessorKey)}`}
													className={cn(
														getCellClassNameByType(column.type, cellClassName),
														column.className,
													)}
												>
													{column.href && !rowHref ? (
														<Link
															href={column.href(item) || "#"}
															className="hover:underline"
														>
															{renderCell(item, column)}
														</Link>
													) : (
														renderCell(item, column)
													)}
												</TableCell>
											) : null,
										)}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</div>

			<div ref={ref} className="flex justify-center items-center w-full py-4">
				{isFetchingNextPage && (
					<Loader2 className="h-6 w-6 animate-spin text-primary" />
				)}
			</div>
		</div>
	);
}
