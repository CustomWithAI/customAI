import { Tiny } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/libs/utils";
import { motion } from "framer-motion";
import { Hand, SquareDashedMousePointer, Trash2 } from "lucide-react";
import { useCallback, useEffect } from "react";

interface ModeSelectorProps {
	mode: "action" | "hand" | "delete";
	onChange: (mode: "action" | "hand" | "delete") => void;
}
export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
			if ("w" === event.key) {
				onChange("action");
			}
			if ("space" === event.key) {
				onChange("hand");
			}
			if ("del" === event.key) {
				onChange("delete");
			}
		},
		[onChange],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<div className="fixed top-1/2 z-[9999] left-4 flex flex-col gap-1 -translate-y-1/2 border border-gray-200 bg-white shadow-lg rounded-lg p-1">
			<TooltipProvider>
				<Tooltip delayDuration={100}>
					<TooltipContent side="right" className="bg-white z-70">
						action
					</TooltipContent>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onChange("action")}
							className={cn(
								"relative flex items-center justify-center border-0 size-10",
							)}
						>
							{mode === "action" && (
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
							<span className={cn("relative z-60")}>
								<SquareDashedMousePointer
									className={cn(
										"size-4",
										mode === "action" ? "white" : "transparent",
									)}
								/>
							</span>
							<Tiny
								className={cn(
									"absolute right-1 bottom-0.5 z-60 text-gray-400",
									{
										"text-gray-900": mode === "action",
									},
								)}
							>
								w
							</Tiny>
						</Button>
					</TooltipTrigger>
				</Tooltip>
			</TooltipProvider>
			<TooltipProvider>
				<Tooltip delayDuration={100}>
					<TooltipContent side="right" className="bg-white z-70">
						hand
					</TooltipContent>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onChange("hand")}
							className={cn(
								"relative flex items-center justify-center border-0 size-10",
							)}
						>
							{mode === "hand" && (
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
							<span className={cn("relative z-60")}>
								<Hand
									className={cn(
										"size-4",
										mode === "hand" ? "white" : "transparent",
									)}
								/>
							</span>
							<Tiny
								className={cn(
									"absolute right-1 bottom-0.5 z-60 text-gray-400",
									{
										"text-gray-900": mode === "hand",
									},
								)}
							>
								space
							</Tiny>
						</Button>
					</TooltipTrigger>
				</Tooltip>
			</TooltipProvider>
			<TooltipProvider>
				<Tooltip delayDuration={100}>
					<TooltipContent side="right" className="bg-white z-70">
						delete
					</TooltipContent>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onChange("delete")}
							className={cn(
								"relative flex items-center justify-center border-0 size-10",
							)}
						>
							{mode === "delete" && (
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
							<span className={cn("relative z-60")}>
								<Trash2
									className={cn(
										"size-4",
										mode === "delete" ? "white" : "transparent",
									)}
								/>
							</span>
							<Tiny
								className={cn(
									"absolute right-1 bottom-0.5 z-60 text-gray-400",
									{
										"text-gray-900": mode === "delete",
									},
								)}
							>
								del
							</Tiny>
						</Button>
					</TooltipTrigger>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
