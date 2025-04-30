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
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";

interface ComboboxProps<T extends object> {
	hook: UseQueryResult<
		ResponsePagination<T> | undefined,
		AxiosError<ResponseError>
	>;
	id?: string;
	keyExtractor: (item: T) => string;
	itemContent: (item: T) => React.ReactNode;
	itemDisplay?: (item: T) => React.ReactNode;
	filter: (search: string) => void;
	placeholder?: string;
	emptyMessage?: string;
	errorMessage?: string;
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	className?: string;
	popoverClassName?: string;
	triggerClassName?: string;
}

export function Combobox<T extends object>({
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
	const { data, isError, error, isLoading } = hook;

	React.useEffect(() => {
		if (value !== undefined) {
			setSelectedValue(value);
		}
	}, [value]);

	const selectedItem = React.useMemo(() => {
		if (!data || !selectedValue) return null;
		return data.data.find((item) => keyExtractor(item) === selectedValue);
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

						{!isLoading && !isError && data?.data?.length === 0 && (
							<CommandEmpty>{emptyMessage}</CommandEmpty>
						)}

						{!isLoading && !isError && data && data.data?.length > 0 && (
							<CommandGroup>
								{data.data.map((item) => {
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
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
