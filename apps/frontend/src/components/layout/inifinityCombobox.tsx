"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ResponsePagination } from "@/types/common";
import type { ResponseError } from "@/types/response/common";
import type {
	InfiniteData,
	UseInfiniteQueryResult,
	UseQueryResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";
import { useInView } from "react-intersection-observer";

/**
 * Props for the InfiniteCombobox component.
 *
 * @template T - The shape of each item in the list.
 */
interface ComboboxProps<T extends object> {
	/**
	 * The infinite query result hook.
	 * Typically from useInfiniteQuery.
	 */
	hook: UseInfiniteQueryResult<
		InfiniteData<ResponsePagination<T> | undefined>,
		Error
	>;

	/**
	 * The ID for the combobox input.
	 */
	id?: string;

	/**
	 * Function to extract a unique key from an item.
	 *
	 * @param item - The item to extract the key from.
	 */
	keyExtractor: (item: T) => string;

	/**
	 * Function that returns the content to render in the dropdown.
	 *
	 * @param item - The item to display.
	 */
	itemContent: (item: T) => React.ReactNode;

	/**
	 * Optional function to control the display value in the input box.
	 *
	 * @param item - The item to represent.
	 */
	itemDisplay?: (item: T) => React.ReactNode;

	/**
	 * Function to call when filtering the list by search input.
	 *
	 * @param search - The current search input value.
	 */
	filter: (search: string) => void;

	/**
	 * Placeholder text in the input.
	 * @default "Search..."
	 */
	placeholder?: string;

	/**
	 * Message to show when no results are found.
	 * @default "No results found."
	 */
	emptyMessage?: string;

	/**
	 * Message to show when data fails to load.
	 * @default "Failed to load data."
	 */
	errorMessage?: string;

	/**
	 * Current selected value.
	 */
	value?: string;

	/**
	 * Callback when the selected value changes.
	 *
	 * @param value - The selected item's key.
	 */
	onChange?: (value: string) => void;

	/**
	 * Whether the combobox is disabled.
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Additional classes to apply to the combobox container.
	 */
	className?: string;

	/**
	 * Additional classes to apply to the dropdown/popover.
	 */
	popoverClassName?: string;

	/**
	 * Additional classes to apply to the trigger button.
	 */
	triggerClassName?: string;
}

export function InfiniteCombobox<T extends object>({
	hook,
	keyExtractor,
	itemContent,
	id,
	itemDisplay,
	filter,
	placeholder = "Search...",
	emptyMessage = "No results found.",
	errorMessage = "Failed to load data.",
	value,
	onChange,
	disabled = false,
	className,
	popoverClassName,
	triggerClassName,
}: ComboboxProps<T>) {
	const [open, setOpen] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState<string>(value || "");
	const [searchInput, setSearchInput] = React.useState<string>("");

	const {
		data,
		isError,
		error,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = hook;

	const { ref, inView } = useInView({
		rootMargin: "0px 0px 100px 0px",
		threshold: 0,
	});

	React.useEffect(() => {
		if (value !== undefined) {
			setSelectedValue(value);
		}
	}, [value]);

	React.useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const selectedItem = React.useMemo(() => {
		if (!data || !selectedValue) return null;
		return data.pages
			.flatMap((page) => page?.data || [])
			.find((item) => keyExtractor(item) === selectedValue);
	}, [data, selectedValue, keyExtractor]);

	const handleSelect = React.useCallback(
		(currentValue: string) => {
			const newValue = selectedValue === currentValue ? "" : currentValue;
			setSelectedValue(newValue);
			if (onChange) {
				onChange(newValue);
			}
			setOpen(false);
		},
		[selectedValue, onChange],
	);

	const handleSearchChange = React.useCallback(
		(search: string) => {
			setSearchInput(search);
			filter(search);
		},
		[filter],
	);

	const items = React.useMemo(() => {
		return data?.pages.flatMap((page) => page?.data || []) || [];
	}, [data]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					id={id}
					aria-expanded={open}
					disabled={disabled}
					className={cn(
						"w-full justify-between",
						disabled && "cursor-not-allowed",
						triggerClassName,
					)}
				>
					{selectedItem ? (
						<span className="truncate min-h-4">
							{itemDisplay
								? itemDisplay(selectedItem)
								: itemContent(selectedItem)}
						</span>
					) : (
						<span className="text-muted-foreground">{placeholder}</span>
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("p-0", popoverClassName)}>
				<Command className={cn("border-gray-200", className)}>
					<CommandInput
						placeholder={placeholder}
						value={searchInput}
						onValueChange={handleSearchChange}
					/>
					<CommandList>
						{isError && (
							<CommandEmpty className="py-6 text-center text-sm">
								<span className="text-destructive">{errorMessage}</span>
								{error && (
									<p className="mt-1 text-xs text-muted-foreground">
										{error.message}
									</p>
								)}
							</CommandEmpty>
						)}

						{isLoading && (
							<CommandEmpty className="py-6 text-center">
								<Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
								<p className="mt-2 text-sm text-muted-foreground">Loading...</p>
							</CommandEmpty>
						)}

						{!isLoading && !isError && items?.length === 0 && (
							<CommandEmpty>{emptyMessage}</CommandEmpty>
						)}

						{!isLoading && !isError && data && items?.length > 0 && (
							<CommandGroup>
								{items.map((item) => {
									const itemKey = keyExtractor(item);
									return (
										<CommandItem
											key={itemKey}
											value={itemKey}
											onSelect={handleSelect}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedValue === itemKey
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											{itemContent(item)}
										</CommandItem>
									);
								})}
								<div
									ref={ref}
									className="flex justify-center items-center w-full py-4"
								>
									{isFetchingNextPage && (
										<Loader2 className="h-6 w-6 animate-spin text-primary" />
									)}
								</div>
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
