import { Badge, type ColorProps } from "@/components/catalyst/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/catalyst/table";
import { Code, SecretCode, Strong, Text } from "@/components/catalyst/text";
import { SkeletonAllActivityTable } from "@/components/skeleton/table";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { applyScalingFactor } from "@/libs/exchange";
import { formatDate, formatShortDate } from "@/libs/format/formatDate";
import { cn } from "@/libs/utils";
import type { NestedKeyOf } from "@/types/response/common";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import toast from "react-hot-toast";
import { Checkbox } from "../catalyst/checkbox";
import {
	Dropdown,
	DropdownButton,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from "../ui/dropdown";

type CellOptions = {
	plain?: {};
	bold?: {};
	number?: {};
	date?: {};
	datetime?: {};
	percentage?: {};
	boolean?: {};
	status?: {
		true: { color: ColorProps; text: string };
		false: { color: ColorProps; text: string };
	};
	badge?: Record<string, { color: ColorProps; text: string }>;
	code?: { secret?: boolean };
	price?: { currency: string };
	custom?: any;
};

type StringMethod = "toLowerCase" | "toUpperCase" | "trim";

type HrefType<T extends object> = (
	| {
			type: "data";
			value: NestedKeyOf<T>;
			special?: StringMethod;
			before?: string;
			after?: string;
	  }
	| {
			type: "string";
			value: string;
	  }
)[];

type BaseColumnType<T extends object> = {
	header: string;
	accessor: NestedKeyOf<T>;
	fallbackAccessor?: NestedKeyOf<T>[];
	callback?: (row: T) => void;
	hidden?: boolean;
	span?: number;
	className?: string;
	renderCustomCellType?: (value: any, options: any) => ReactNode;
};

export type TablesColumnType<T extends object> =
	| (BaseColumnType<T> & { cellType: "plain"; options?: CellOptions["plain"] })
	| (BaseColumnType<T> & { cellType: "bold"; options?: CellOptions["bold"] })
	| (BaseColumnType<T> & {
			cellType: "number";
			options?: CellOptions["number"];
	  })
	| (BaseColumnType<T> & { cellType: "date"; options?: CellOptions["date"] })
	| (BaseColumnType<T> & {
			cellType: "datetime";
			options?: CellOptions["datetime"];
	  })
	| (BaseColumnType<T> & {
			cellType: "percentage";
			options?: CellOptions["percentage"];
	  })
	| (BaseColumnType<T> & { cellType: "status"; options: CellOptions["status"] })
	| (BaseColumnType<T> & { cellType: "badge"; options: CellOptions["badge"] })
	| (BaseColumnType<T> & { cellType: "code"; options: CellOptions["code"] })
	| (BaseColumnType<T> & { cellType: "price"; options: CellOptions["price"] })
	| (BaseColumnType<T> & {
			cellType: "boolean";
			options?: CellOptions["boolean"];
	  })
	| (BaseColumnType<T> & {
			cellType: "custom";
			options?: CellOptions["custom"];
	  });

type ResizingState = {
	isResizing: boolean;
	columnKey: string | null;
	startX: number;
	startWidth: number;
};

type TableBuilderPropsType<T extends object> = {
	data: T[];
	columns: TablesColumnType<T>[];
	header?: (ColumnEditor: ReactNode) => ReactNode;
	status: boolean;
	onPrefetch?: (id: string) => void;
	href?: HrefType<T>;
	actions?: (id: string, value?: T) => ReactNode;
};

const TableBuilder = <T extends object>({
	data,
	columns,
	onPrefetch,
	href,
	header,
	status,
	actions,
}: TableBuilderPropsType<T>) => {
	const [columnsChecked, setColumnsChecked] = useState<Record<string, boolean>>(
		columns.reduce(
			(acc, col) => {
				acc[String(col.header)] = !col.hidden;
				return acc;
			},
			{} as Record<string, boolean>,
		),
	);
	const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
		columns.reduce(
			(acc, col) => {
				acc[String(col.header)] = 200;
				return acc;
			},
			{} as Record<string, number>,
		),
	);

	const resizingRef = useRef<ResizingState>({
		isResizing: false,
		columnKey: null,
		startX: 0,
		startWidth: 0,
	});

	const [copiedText, copy] = useCopyToClipboard();

	const copyToClipBoard = (code: string) => {
		copy(code)
			.then(() =>
				toast.success(
					<span>
						copied <strong className="break-all">{copiedText}</strong> to
						clipboard
					</span>,
				),
			)
			.catch((error) => toast.error(`failed to copy: ${error.message}`));
	};

	const handleMouseDown = useCallback(
		(e: React.MouseEvent<HTMLDivElement>, columnKey: string) => {
			resizingRef.current = {
				isResizing: true,
				columnKey,
				startX: e.clientX,
				startWidth: columnWidths[columnKey],
			};
		},
		[columnWidths],
	);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (resizingRef.current.isResizing && resizingRef.current.columnKey) {
			const { columnKey, startX, startWidth } = resizingRef.current;
			const newWidth = startWidth + (e.clientX - startX);

			setColumnWidths((prevWidths) => ({
				...prevWidths,
				[columnKey]: newWidth,
			}));
		}
	}, []);

	const handleMouseUp = useCallback(() => {
		resizingRef.current.isResizing = false;
	}, []);

	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	const filterColumns = useMemo(() => {
		return columns.filter((column) => columnsChecked[column.header]);
	}, [columnsChecked, columns]);

	const getValue = (obj: any, path: string) => {
		return path.split(".").reduce((acc, part) => acc?.[part], obj);
	};

	function generateHref<T extends object>(
		href?: HrefType<T>,
		element?: T,
	): string | undefined {
		if (!href || !element) return undefined;
		return href
			.map((item) => {
				let value = "";

				if (item.type === "string") {
					value = item.value;
				} else if (item.type === "data") {
					const dataValue = String((element as any)[item.value]);
					const transformedValue = item.special
						? dataValue[item.special]()
						: dataValue;
					value = `${item.before || ""}${transformedValue}${item.after || ""}`;
				}

				return value.startsWith("/") ? value : `/${value}`;
			})
			.join("");
	}

	const renderCell = (
		type: keyof CellOptions,
		value: T,
		accessor: string,
		fallbackAccessor: string[] | undefined,
		options?: any,
		renderCustom?: (value: T, options: any) => ReactNode,
	) => {
		const cellValue =
			getValue(value, accessor) ??
			(fallbackAccessor?.some((acc) => getValue(value, acc))
				? getValue(
						value,
						fallbackAccessor.find((acc) => getValue(value, acc)) || "",
					)
				: "-");
		switch (type) {
			case "plain":
				return <Text className="max-w-xs truncate">{String(cellValue)}</Text>;
			case "bold":
				return (
					<Strong className="max-w-sm truncate">{String(cellValue)}</Strong>
				);
			case "number":
				return (
					<Text className="max-w-sm truncate">
						{Number(cellValue).toLocaleString()}
					</Text>
				);
			case "percentage":
				return <Text className="max-w-sm truncate">{Number(cellValue)} %</Text>;
			case "datetime":
				return (
					<Text className="max-w-sm truncate">
						{formatDate(String(cellValue))}
					</Text>
				);
			case "date":
				return (
					<Text className="max-w-sm truncate">
						{formatShortDate(String(cellValue))}
					</Text>
				);
			case "status": {
				const statusValue = Boolean(cellValue);
				console.log(cellValue, statusValue);
				const statusColor = statusValue
					? (options as CellOptions["status"])?.true.color || "green"
					: (options as CellOptions["status"])?.false.color || "red";
				return (
					<Badge color={statusColor}>
						{statusValue
							? (options as CellOptions["status"])?.true.text || "Active"
							: (options as CellOptions["status"])?.false.text || "Inactive"}
					</Badge>
				);
			}
			case "badge": {
				const badgeValue = String(cellValue);
				const badgeColor =
					(options as CellOptions["badge"])?.[badgeValue]?.color ||
					(badgeValue ? "green" : "zinc");
				return (
					<Badge color={badgeColor as ColorProps}>
						{(options as CellOptions["badge"])?.[badgeValue]?.text ||
							badgeValue}
					</Badge>
				);
			}
			case "boolean":
				return <Checkbox color="blue" defaultChecked={cellValue} disabled />;
			case "code": {
				const UseSecretCode = (options as CellOptions["code"])?.secret
					? SecretCode
					: Code;
				const codeValue = String(cellValue);
				return (
					<UseSecretCode
						onClick={() => copyToClipBoard(codeValue || "")}
						className={cn(
							"line-clamp-3 min-h-12 text-wrap break-all p-1 border-gray-200",
							" duration-200 hover:cursor-pointer hover:border-dashed",
							" hover:bg-zinc-950/5 dark:hover:bg-zinc-950/60",
						)}
					>
						{codeValue}
					</UseSecretCode>
				);
			}
			case "price": {
				const defaultCurrency =
					(options as CellOptions["price"])?.currency ||
					(value as any)?.currency ||
					undefined;
				const isArray = Array.isArray(cellValue);
				const element = isArray
					? (cellValue as any[]).find(
							(price: any) => price.currency === defaultCurrency,
						) || (cellValue as any[])[0]
					: cellValue;
				return (
					<Text
						className={cn({
							"text-red-400 dark:text-red-800":
								Number(element?.price || element || 0) < 0,
						})}
					>
						{applyScalingFactor(
							Number(element?.price || element) || 0,
							Number(
								element?.scaling_factor || (value as any).scaling_factor,
							) || 1,
						).toFormat(2)}{" "}
						{String(element?.currency || (value as any).currency) || "(null)"}
					</Text>
				);
			}
			case "custom":
				return renderCustom ? (
					renderCustom(value, options as CellOptions["custom"])
				) : (
					<span>{String(cellValue)}</span>
				);
			default:
				return <span>{String(cellValue)}</span>;
		}
	};

	const RenderUpper = () => {
		return (
			<div className="h-fit">
				<Dropdown>
					<DropdownButton outline>
						Columns
						<ChevronDownIcon />
					</DropdownButton>
					<DropdownMenu anchor="bottom end">
						{Object.entries(columnsChecked).map(([key, value]) => (
							<DropdownItem
								onClick={() => {
									setColumnsChecked((prev) => ({
										...prev,
										[key]: !prev[key],
									}));
								}}
								key={key}
							>
								<DropdownLabel>{key}</DropdownLabel>
								{value && <CheckIcon />}
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>
		);
	};

	return (
		<>
			{header ? header(<RenderUpper />) : null}
			<Table className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
				<TableHead>
					<TableRow>
						{filterColumns.map((column, colIndex) => (
							<TableHeader
								style={{ width: columnWidths[column.header] }}
								colSpan={column.span}
								className={cn(column.className, "relative")}
								key={colIndex}
							>
								{column.header}
								<div
									className="absolute top-0 right-0 w-1 h-full bg-gray-400 cursor-col-resize"
									onMouseDown={(e) => handleMouseDown(e, column.header)}
								/>
							</TableHeader>
						))}
						{actions ? (
							<TableHeader className="relative w-8">
								<span className="sr-only">Actions</span>
							</TableHeader>
						) : null}
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={columns.reduce(
									(sum, column) => sum + (column.span || 1),
									0,
								)}
								className={cn("h-80 text-center font-medium text-zinc-400", {
									"h-10 text-start": status,
								})}
							>
								{status ? (
									<>
										<SkeletonAllActivityTable />
										<SkeletonAllActivityTable />
									</>
								) : (
									"no data at the moment"
								)}
							</TableCell>
						</TableRow>
					) : null}
					{data
						? data.map((element, rowIndex) => (
								<TableRow
									href={href ? generateHref(href, element) : undefined}
									onMouseEnter={
										onPrefetch
											? () => onPrefetch((element as any).id)
											: undefined
									}
									id={`${href || (element as any).id}${rowIndex}`}
									key={rowIndex}
									className={cn({
										"cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800":
											href,
									})}
								>
									{filterColumns.map((column, colIndex) => (
										<TableCell key={`${rowIndex}${colIndex}`}>
											{renderCell(
												column.cellType,
												element,
												column.accessor,
												column.fallbackAccessor,
												column.options,
												column.renderCustomCellType,
											)}
										</TableCell>
									))}
									{actions ? (
										<TableCell>
											{actions((element as any).id, element)}
										</TableCell>
									) : null}
								</TableRow>
							))
						: null}
				</TableBody>
			</Table>
		</>
	);
};

export default TableBuilder;
