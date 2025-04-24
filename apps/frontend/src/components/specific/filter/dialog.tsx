"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FilterCapability } from "@/types/filter";
import { ArrowUpDown, FilterIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";

export type FilterValue = {
	[key: string]: any;
};

export type FilterOption = {
	id: string;
	label: string;
	type: "checkbox" | "text" | "number" | "select" | "sort";
	options?: { value: string; label: string }[];
	capability?: FilterCapability;
};

type FilterDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	filterOptions: FilterOption[];
	values?: FilterValue;
	onApply: (key: string, value: any, capability?: FilterCapability) => void;
	onReset: () => void;
};

export function FilterDialog({
	open,
	onOpenChange,
	filterOptions,
	values = {},
	onApply,
	onReset,
}: FilterDialogProps) {
	const [localValues, setLocalValues] = useState<FilterValue>(values || {});
	const [activeTab, setActiveTab] = useState<string>("all");

	const filterOptionsByCapability = {
		filter: filterOptions.filter((opt) => opt.capability === "filter"),
		search: filterOptions.filter((opt) => opt.capability === "search"),
		sort: filterOptions.filter((opt) => opt.capability === "sort"),
		all: filterOptions,
	};

	useEffect(() => {
		setLocalValues(values || {});
	}, [values]);

	const handleChange = (
		id: string,
		value: any,
		capability?: FilterCapability,
	) => {
		let updatedValue: string = value;
		if (capability === "sort" && value && !value.startsWith("sort:")) {
			updatedValue = `sort:${value}`;
		}

		setLocalValues((prev) => ({
			...prev,
			[id]: updatedValue,
		}));
	};

	const handleApply = () => {
		for (const [key, value] of Object.entries(localValues)) {
			if (value !== values?.[key]) {
				const option = filterOptions.find((opt) => opt.id === key);
				onApply(key, value, option?.capability);
			}
		}
		onOpenChange(false);
	};

	const handleReset = () => {
		setLocalValues({});
		onReset();
	};

	const activeFilterCount = Object.entries(localValues || {}).filter(
		([_, value]) => {
			if (typeof value === "boolean") return value;
			if (Array.isArray(value)) return value.length > 0;
			return value !== "" && value !== undefined && value !== null;
		},
	).length;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Filter Parameters</span>
						{activeFilterCount > 0 && (
							<Badge variant="secondary" className="ml-2">
								{activeFilterCount} active
							</Badge>
						)}
					</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid grid-cols-4 mb-4">
						<TabsTrigger value="all" className="flex items-center gap-1">
							All
						</TabsTrigger>
						<TabsTrigger value="filter" className="flex items-center gap-1">
							<FilterIcon size={14} />
							Filter
						</TabsTrigger>
						<TabsTrigger value="search" className="flex items-center gap-1">
							<Search size={14} />
							Search
						</TabsTrigger>
						<TabsTrigger value="sort" className="flex items-center gap-1">
							<ArrowUpDown size={14} />
							Sort
						</TabsTrigger>
					</TabsList>

					{(["all", "filter", "search", "sort"] as const).map((tabValue) => (
						<TabsContent key={tabValue} value={tabValue} className="mt-0">
							<ScrollArea className="h-[60vh] pr-4">
								<div className="space-y-6 py-4">
									{filterOptionsByCapability[tabValue].length === 0 ? (
										<div className="text-center py-4 text-muted-foreground">
											No {tabValue} options available
										</div>
									) : (
										filterOptionsByCapability[tabValue].map((option) => (
											<div
												key={`${option.id}-${option.capability}`}
												className="space-y-2"
											>
												<div className="flex items-center gap-2">
													{option.capability === "filter" && (
														<FilterIcon
															size={14}
															className="text-muted-foreground"
														/>
													)}
													{option.capability === "search" && (
														<Search
															size={14}
															className="text-muted-foreground"
														/>
													)}
													{option.capability === "sort" && (
														<ArrowUpDown
															size={14}
															className="text-muted-foreground"
														/>
													)}
													<Label htmlFor={`${option.id}-${option.capability}`}>
														{option.label}
													</Label>
												</div>

												{option.type === "checkbox" && (
													<div className="flex items-center space-x-2">
														<Checkbox
															id={`${option.id}-${option.capability}`}
															checked={!!localValues[option.id]}
															onCheckedChange={(checked) =>
																handleChange(
																	option.id,
																	checked,
																	option.capability,
																)
															}
														/>
														<Label
															htmlFor={`${option.id}-${option.capability}`}
															className="cursor-pointer"
														>
															Enable
														</Label>
													</div>
												)}

												{option.type === "text" && (
													<Input
														id={`${option.id}-${option.capability}`}
														value={localValues[option.id] || ""}
														onChange={(e) =>
															handleChange(
																option.id,
																e.target.value,
																option.capability,
															)
														}
														placeholder={`Enter ${option.label.toLowerCase()}`}
													/>
												)}

												{option.type === "number" && (
													<Input
														id={`${option.id}-${option.capability}`}
														type="number"
														value={localValues[option.id] || ""}
														onChange={(e) =>
															handleChange(
																option.id,
																e.target.value,
																option.capability,
															)
														}
														placeholder={`Enter ${option.label.toLowerCase()}`}
													/>
												)}

												{option.type === "select" && option.options && (
													<div className="space-y-2">
														{option.options.map((opt) => (
															<div
																key={opt.value}
																className="flex items-center space-x-2"
															>
																<Checkbox
																	id={`${option.id}-${option.capability}-${opt.value}`}
																	checked={localValues[option.id]?.includes(
																		opt.value,
																	)}
																	onCheckedChange={(checked) => {
																		const currentValues =
																			localValues[option.id] || [];
																		const newValues = checked
																			? [...currentValues, opt.value]
																			: currentValues.filter(
																					(v: string) => v !== opt.value,
																				);
																		handleChange(
																			option.id,
																			newValues,
																			option.capability,
																		);
																	}}
																/>
																<Label
																	htmlFor={`${option.id}-${option.capability}-${opt.value}`}
																	className="cursor-pointer"
																>
																	{opt.label}
																</Label>
															</div>
														))}
													</div>
												)}

												{option.type === "sort" && (
													<div className="space-y-2">
														<div className="flex items-center space-x-2">
															<Checkbox
																id={`${option.id}-${option.capability}-asc`}
																checked={localValues[option.id] === "sort:asc"}
																onCheckedChange={(checked) => {
																	if (checked) {
																		handleChange(
																			option.id,
																			"sort:asc",
																			option.capability,
																		);
																	} else if (
																		localValues[option.id] === "sort:asc"
																	) {
																		handleChange(
																			option.id,
																			"",
																			option.capability,
																		);
																	}
																}}
															/>
															<Label
																htmlFor={`${option.id}-${option.capability}-asc`}
																className="cursor-pointer"
															>
																Ascending
															</Label>
														</div>
														<div className="flex items-center space-x-2">
															<Checkbox
																id={`${option.id}-${option.capability}-desc`}
																checked={localValues[option.id] === "sort:desc"}
																onCheckedChange={(checked) => {
																	if (checked) {
																		handleChange(
																			option.id,
																			"sort:desc",
																			option.capability,
																		);
																	} else if (
																		localValues[option.id] === "sort:desc"
																	) {
																		handleChange(
																			option.id,
																			"",
																			option.capability,
																		);
																	}
																}}
															/>
															<Label
																htmlFor={`${option.id}-${option.capability}-desc`}
																className="cursor-pointer"
															>
																Descending
															</Label>
														</div>
													</div>
												)}
											</div>
										))
									)}
								</div>
							</ScrollArea>
						</TabsContent>
					))}
				</Tabs>

				<DialogFooter className="flex justify-between sm:justify-between">
					<Button variant="outline" onClick={handleReset}>
						Reset
					</Button>
					<Button onClick={handleApply}>Apply Filters</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
