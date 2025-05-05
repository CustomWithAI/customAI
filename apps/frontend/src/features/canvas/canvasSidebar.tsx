"use client";

import { Subtle } from "@/components/typography/text";
import { cn } from "@/libs/utils";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { LabelSidebar, type LabelSidebarProps } from "./label-sidebar";
import { ZoomControls, type ZoomControlsProps } from "./zoom-control";

export type OpenTab = "labels" | "zoom" | "none";
export function CanvasSidebar({
	labels = [],
	onAddLabel,
	onRemoveLabel,
	onLabelClick,
	onUpdateLabel,
	selectedLabel,
	onZoomToFit,
	usedLabels,
	width,
	height,
	zoom,
	onZoomUpdate,
	onZoomChange,
}: Omit<LabelSidebarProps, "open" | "setOpen"> &
	Omit<ZoomControlsProps, "open" | "setOpen">) {
	const [open, setOpen] = useState<OpenTab>("labels");
	return (
		<div
			className={cn(
				"fixed right-4 z-98 top-1/2 bg-white w-64 border transition-all duration-150",
				" -translate-y-1/2 rounded-md border-gray-200 h-2/3 flex flex-col",
				open !== "none" ? "w-64 max-w-64 opacity-100" : "w-0 max-w-0",
			)}
		>
			<button
				type="button"
				onClick={() => setOpen((o) => (o === "none" ? "labels" : "none"))}
				className={cn(
					"group transition-all duration-100 absolute hover:bg-zinc-50 p-1 top-4",
					" flex justify-center items-center -left-9 border bg-white z-97 border-gray-200 rounded-md rounded-r-none border-r-0",
					{ "hover:left-[-94px]": open === "none" },
					{ hidden: open === "zoom" },
				)}
			>
				<ChevronLeft
					className={cn("size-6 m-0.5 transition-transform duration-150", {
						"rotate-180 ": open === "labels",
					})}
				/>
				<Subtle
					className={cn("w-0 duration-100 transition-all overflow-hidden", {
						"group-hover:w-14 ": open === "none",
					})}
				>
					label
				</Subtle>
			</button>
			<button
				type="button"
				onClick={() => setOpen((o) => (o === "none" ? "zoom" : "none"))}
				className={cn(
					"group transition-all duration-100 absolute hover:bg-zinc-50 p-1 top-16",
					" flex justify-center items-center -left-9 border bg-white z-97 border-gray-200 rounded-md rounded-r-none border-r-0",
					{ "hover:left-[-94px]": open === "none" },
					{ hidden: open === "labels" },
				)}
			>
				<ChevronLeft
					className={cn("size-6 m-0.5 transition-transform duration-150", {
						"rotate-180 ": open === "zoom",
					})}
				/>
				<Subtle
					className={cn("w-0 duration-100 transition-all overflow-hidden", {
						"group-hover:w-14 ": open === "none",
					})}
				>
					zoom
				</Subtle>
			</button>
			<LabelSidebar
				labels={labels}
				onAddLabel={onAddLabel}
				onRemoveLabel={onRemoveLabel}
				selectedLabel={selectedLabel}
				onLabelClick={onLabelClick}
				onUpdateLabel={onUpdateLabel}
				open={open === "labels"}
				setOpen={(isSetOpen) => setOpen(isSetOpen ? "labels" : "none")}
				usedLabels={usedLabels}
			/>
			<ZoomControls
				zoom={zoom}
				onZoomUpdate={onZoomUpdate}
				onZoomChange={onZoomChange}
				open={open === "zoom"}
				setOpen={(isSetOpen) => setOpen(isSetOpen ? "zoom" : "none")}
				onZoomToFit={onZoomToFit}
				width={width}
				height={height}
			/>
		</div>
	);
}
