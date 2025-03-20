"use client";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverContentDialog,
	PopoverTrigger,
} from "@/components/ui/popover";

const colors = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#84cc16",
	"#22c55e",
	"#14b8a6",
	"#3b82f6",
	"#6366f1",
	"#a855f7",
	"#ec4899",
];

interface ColorPickerProps {
	value?: string;
	onChange?: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-8 h-8 p-0 mt-0 ml-1"
					style={{ backgroundColor: value }}
				>
					<span className="sr-only">Pick a color</span>
				</Button>
			</PopoverTrigger>
			<PopoverContentDialog
				className="w-64 bg-white"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="grid grid-cols-5 gap-2">
					{colors.map((color) => (
						<button
							key={color}
							className="w-8 h-8 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
							style={{ backgroundColor: color }}
							onClick={(e) => {
								e.stopPropagation();
								onChange?.(color);
							}}
						>
							<span className="sr-only">Pick {color}</span>
						</button>
					))}
				</div>
			</PopoverContentDialog>
		</Popover>
	);
}
