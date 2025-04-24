"use client";

import { Badge } from "@/components/ui/badge";
import type { FilterCapability } from "@/types/filter";
import { ArrowUpDown, Filter, Hand, Search, X } from "lucide-react";

type FilterBadgeProps = {
	label: string;
	value: string | boolean;
	capability: FilterCapability;
	isManual?: boolean;
	onRemove: () => void;
};

export function FilterBadge({
	label,
	value,
	capability,
	isManual,
	onRemove,
}: FilterBadgeProps) {
	let displayValue = typeof value === "boolean" ? "Yes" : value;

	if (capability === "sort") {
		displayValue = displayValue === "asc" ? "Ascending" : "Descending";
	}

	const Icon = isManual
		? Hand
		: capability === "search"
			? Search
			: capability === "sort"
				? ArrowUpDown
				: Filter;

	return (
		<Badge
			variant={isManual ? "default" : "secondary"}
			className={`mr-2 mb-2 ${isManual ? "bg-primary/20 hover:bg-primary/30 text-primary" : ""}`}
		>
			<Icon size={12} className="mr-1" />
			<span className="mr-1 font-medium">{label}:</span>
			<span>{displayValue}</span>
			<button
				onClick={onRemove}
				className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
				aria-label={`Remove ${label} filter`}
			>
				<X size={14} />
			</button>
		</Badge>
	);
}
