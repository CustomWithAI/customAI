"use client";

import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	format,
	startOfMonth,
} from "date-fns";

import { Content } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/libs/utils";
import { CalendarDays } from "lucide-react";
import { useState } from "react";

type DatePickerWithPresetsProps = {
	value: Date | undefined;
	onDateChange: (date: Date | undefined) => void;
	interval_count?: number;
	isEndDate?: boolean;
	startDate?: Date | undefined;
};

const getPattern: Record<string, string> = {
	int: "^\\d+$",
	float: "^\\d+(\\.\\d+)?$",
} as const;

export function DatePickerWithPresets({
	value,
	onDateChange,
	isEndDate = false,
	interval_count = 1,
	startDate,
}: DatePickerWithPresetsProps) {
	const [cycleLength, setCycleLength] = useState<number>(1);
	const intervalType: Record<
		string,
		(date: Date | number | string, amount: number) => Date
	> = {
		day: addDays,
		week: addWeeks,
		month: addMonths,
		year: addYears,
	};
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start Content-left font-normal",
						!value && "Content-muted-foreground",
					)}
				>
					<CalendarDays className="mr-2 h-4 w-4" />
					{value ? format(value, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="flex w-auto flex-col space-y-2 p-2">
				{isEndDate ? (
					<div className="flex items-center gap-x-3 px-3">
						<Input
							type="number"
							className="shrink"
							pattern={getPattern.int}
							min={0}
							step={1}
							onChange={(event) => {
								const cycle = event.target.valueAsNumber;
								if (Number.isNaN(cycle) || cycle < 0) return undefined;
								setCycleLength(cycle);
								if (startDate) {
									onDateChange(
										intervalType.month(
											new Date(startDate),
											cycle * interval_count,
										),
									);
								}
							}}
							value={Number.isNaN(cycleLength) ? undefined : cycleLength}
						/>
						<Content className="flex-none">cycles</Content>
					</div>
				) : (
					<Select
						onValueChange={(value) => {
							if (value === "startOfMonth") {
								onDateChange(startOfMonth(addMonths(new Date(), 1)));
							} else {
								onDateChange(addDays(new Date(), Number.parseInt(value)));
							}
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent position="popper">
							<SelectItem value="startOfMonth">1st of next month</SelectItem>
							<SelectItem value="0">Today</SelectItem>
							<SelectItem value="1">Tomorrow</SelectItem>
							<SelectItem value="3">In 3 days</SelectItem>
							<SelectItem value="7">In a week</SelectItem>
						</SelectContent>
					</Select>
				)}
				<div className="rounded-md border border-gray-200">
					<Calendar
						mode="single"
						disabled={
							isEndDate && startDate ? { before: startDate } : undefined
						}
						selected={value}
						onSelect={onDateChange}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
