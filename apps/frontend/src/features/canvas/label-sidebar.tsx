import { Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/libs/utils";
import type { Label } from "@/types/square";
import { ChevronLeft, Edit2, Plus, X } from "lucide-react";
import { useState } from "react";
import { EditLabelDialog } from "./edit-label-dialog";

export interface LabelSidebarProps {
	labels: Label[];
	onAddLabel: () => void;
	onRemoveLabel: (id: string) => void;
	onLabelClick: (id: string) => void;
	onUpdateLabel: (label: Label) => void;
	selectedLabel?: string;
	open: boolean;
	setOpen: (isSetOpen: boolean) => void;
	usedLabels: string[]; // Array of label IDs that are currently assigned to squares
}

export function LabelSidebar({
	labels = [],
	onAddLabel,
	onRemoveLabel,
	onLabelClick,
	onUpdateLabel,
	selectedLabel,
	open,
	setOpen,
	usedLabels,
}: LabelSidebarProps) {
	const [editingLabel, setEditingLabel] = useState<Label | null>(null);
	return (
		<>
			{open && (
				<>
					<div className="p-4 border-b border-gray-200">
						<div className="flex items-center justify-between mb-2">
							<h3 className="font-semibold">Labels</h3>
							<Button onClick={onAddLabel} variant="outline" size="sm">
								<Plus className="w-4 h-4" />
							</Button>
						</div>
					</div>
					<ScrollArea className="flex-1">
						<div className="p-4 space-y-2">
							{labels.map((label, index) => {
								const labelCounts = usedLabels.filter(
									(l) => l === label.id,
								).length;
								return (
									<div
										onKeyDown={(e) => {
											if (e.key === "ArrowDown") {
												const nextElement = document.querySelector(
													`[data-index="${index + 1}"]`,
												) as HTMLElement | null;
												nextElement?.focus();
											} else if (e.key === "ArrowUp") {
												const prevElement = document.querySelector(
													`[data-index="${index - 1}"]`,
												) as HTMLElement | null;
												prevElement?.focus();
											}
										}}
										key={label.id}
										data-index={index}
										onClick={() => onLabelClick(label.id)}
										className={cn(
											"group flex relative items-center justify-between p-2 rounded-md gap-x-3",
											"cursor-pointer hover:bg-gray-100",
										)}
									>
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: label.color }}
											/>
											<span className="text-sm">
												{label.name} {labelCounts > 0 ? `(${labelCounts})` : ""}
											</span>
										</div>
										<div className=" absolute left-40 z-99 group-hover:bg-white duration-100 rounded-sm p-1 flex items-center gap-1 ml-auto">
											<Button
												variant="ghost"
												size="sm"
												className="opacity-0 group-hover:opacity-100 hover:bg-zinc-100/80 h-6 w-6 p-0"
												onClick={(e) => {
													e.stopPropagation();
													setOpen(false);
													setEditingLabel(label);
												}}
											>
												<Edit2 className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="opacity-0 group-hover:opacity-100 hover:bg-zinc-100/80 h-6 w-6 p-0"
												onClick={(e) => {
													e.stopPropagation();
													onRemoveLabel(label.id);
												}}
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									</div>
								);
							})}
						</div>
					</ScrollArea>
				</>
			)}
			{editingLabel && (
				<EditLabelDialog
					label={editingLabel}
					open={true}
					onClose={() => {
						setEditingLabel(null);
						setOpen(true);
					}}
					onSave={onUpdateLabel}
				/>
			)}
		</>
	);
}
