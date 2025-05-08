"use client";

import { Eye, EyeOff, Settings2 } from "lucide-react";
import { useState } from "react";

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
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
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

export type StaticTableProps<TData extends object> = {
	data: TData[];
	columns: ColumnDef<TData>[];
	keyField: keyof TData;
	enableColumnVisibility?: boolean;
	bordered?: boolean;
	fullWidth?: boolean;
	striped?: boolean;
	clickableRows?: boolean;
	className?: string;
	headerClassName?: string;
	cellClassName?: string;
	onRowClick?: (item: TData) => void;
	columnStyles?: Array<{
		column: string;
		type: ColumnType;
	}>;
	emptyMessage?: string;
};

export function TableStatic<TData extends object>({
	data,
	columns,
	keyField,
	enableColumnVisibility = true,
	bordered = true,
	fullWidth = true,
	striped = false,
	clickableRows = false,
	className,
	headerClassName,
	cellClassName,
	onRowClick,
	columnStyles = [],
	emptyMessage = "No items found",
}: StaticTableProps<TData>) {
	const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
		() =>
			Object.fromEntries(columns.map((c) => [c.accessorKey.toString(), true])),
	);

	const columnsWithStyles = columns.map((column) => {
		const override = columnStyles.find(
			(cs) => cs.column === column.accessorKey.toString(),
		);
		return override ? { ...column, type: override.type } : column;
	});

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
		if (column.cell) return column.cell(item);
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
							<Button variant="outline" size="sm">
								<Settings2 className="h-4 w-4 mr-2" />
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{columnsWithStyles.map((column) => {
								const key = column.accessorKey.toString();
								return (
									<DropdownMenuCheckboxItem
										key={key}
										checked={visibleColumns[key]}
										onCheckedChange={(checked) =>
											setVisibleColumns((prev) => ({
												...prev,
												[key]: checked,
											}))
										}
									>
										{visibleColumns[key] ? (
											<Eye className="h-4 w-4 mr-2" />
										) : (
											<EyeOff className="h-4 w-4 mr-2" />
										)}
										{column.header}
									</DropdownMenuCheckboxItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}

			<div className={cn("rounded-md", bordered && "border border-gray-200")}>
				<ScrollArea className="w-full" type="always">
					<div className="min-w-full">
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
								{data.length === 0 ? (
									<TableRow>
										<TableCell colSpan={columns.length} className="text-center">
											{emptyMessage}
										</TableCell>
									</TableRow>
								) : (
									data.map((item, index) => {
										const rowKey = item[keyField]
											? String(item[keyField])
											: index.toString();

										const rowHref =
											clickableRows && !onRowClick
												? columnsWithStyles
														.find((col) => col.href)
														?.href?.(item) || "#"
												: undefined;

										const handleClick =
											clickableRows && onRowClick
												? () => onRowClick(item)
												: undefined;

										return (
											<TableRow
												key={rowKey}
												className={cn(
													clickableRows && "cursor-pointer hover:bg-muted/50",
													striped && index % 2 === 1 && "bg-muted/50",
												)}
												onClick={handleClick}
											>
												{columnsWithStyles.map((column) =>
													visibleColumns[column.accessorKey.toString()] ? (
														<TableCell
															key={`${rowKey}-${String(column.accessorKey)}`}
															className={cn(
																getCellClassNameByType(
																	column.type,
																	cellClassName,
																),
																column.className,
															)}
														>
															{renderCell(item, column)}
														</TableCell>
													) : null,
												)}
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
