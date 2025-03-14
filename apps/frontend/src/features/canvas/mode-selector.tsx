import { Tiny } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/libs/utils";
import type { Mode } from "@/types/square";
import { motion } from "framer-motion";
import {
	Download,
	Hexagon,
	MousePointer2,
	Pencil,
	Square,
	Trash2,
	Upload,
} from "lucide-react";
import { cloneElement, useCallback, useEffect } from "react";

const MODES: (
	| {
			id: Mode | "export" | "import";
			icon: JSX.Element;
			color?: string;
			key: string;
			onClick?: Function;
			type?: string;
	  }
	| {
			id: "line";
			icon?: never;
			color?: never;
			key?: never;
			onClick?: never;
			type?: never;
	  }
)[] = [
	{ id: "square", icon: <Square />, key: "1", type: "object_detection" },
	{ id: "polygon", icon: <Hexagon />, key: "2", type: "object_detection" },
	{ id: "freehand", icon: <Pencil />, key: "3", type: "segmentation" },
	{ id: "select", icon: <MousePointer2 />, key: "S", type: "classification" },
	{ id: "delete", icon: <Trash2 />, color: "text-red-600", key: "D" },
	{ id: "line" },
	{ id: "export", icon: <Download />, key: "E" },
	{ id: "import", icon: <Upload />, key: "I" },
];

interface ModeSelectorProps {
	type: string;
	mode: Mode;
	onChange: (mode: Mode) => void;
	editorId: string;
	handleExport: () => void;
	handleImport: (json: string | object) => void;
}
export function ModeSelector({
	type,
	mode,
	onChange,
	editorId,
	handleExport,
	handleImport,
}: ModeSelectorProps) {
	const handleClick = useCallback(
		<T,>(id: T) => {
			if (!id) return;
			switch (id) {
				case "export":
					document.getElementById(`import-json-${editorId}`)?.click();
					break;
				case "import":
					handleExport();
					break;
				case "line":
					break;
				default: {
					onChange(id as Mode);
					break;
				}
			}
		},
		[editorId, handleExport, onChange],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
			const id = MODES.find(
				(m) => m.key?.toLocaleLowerCase() === event.key,
			)?.id;
			handleClick(id);
		},
		[handleClick],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<div className="fixed top-1/2 left-4 z-40 flex flex-col gap-1 -translate-y-1/2 border border-gray-200 bg-white shadow-lg rounded-lg p-1">
			{MODES.map(({ id, icon, color, key, type: modeType }) => {
				if (id === "line") {
					return <div key={id} className="w-full border-t" />;
				}
				if (modeType && type !== modeType) {
					return null;
				}
				return (
					<TooltipProvider key={id}>
						<Tooltip delayDuration={100}>
							<TooltipContent side="right" className="bg-white z-[70]">
								{id}
							</TooltipContent>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleClick(id)}
									className={cn(
										"relative flex items-center justify-center border-0 size-10",
										color,
									)}
								>
									{mode === id && (
										<motion.div
											layoutId="active-mode"
											className="absolute inset-0 bg-indigo-200 z-50 dark:bg-blue-700 rounded-md"
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 20,
											}}
										/>
									)}
									<span className={cn("relative z-[60]", { "": mode === id })}>
										{cloneElement(icon, {
											className: cn("w-4 h-4"),
											fill: mode === id ? "white" : "transparent",
										})}
									</span>
									<Tiny
										className={cn(
											"absolute right-1 bottom-0.5 z-[60] text-gray-400",
											{
												"text-gray-900": mode === id,
											},
										)}
									>
										{key}
									</Tiny>
								</Button>
							</TooltipTrigger>
						</Tooltip>
					</TooltipProvider>
				);
			})}
			<input
				id={`import-json-${editorId}`}
				type="file"
				accept=".json"
				onChange={handleImport}
				className="hidden"
			/>
		</div>
	);
}
