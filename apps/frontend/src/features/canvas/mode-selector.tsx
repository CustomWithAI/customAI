import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import type { Mode } from "@/types/square";
import { motion } from "framer-motion";
import { Hexagon, MousePointer2, Pencil, Square, Trash2 } from "lucide-react";

const MODES: { id: Mode; icon: JSX.Element; color?: string }[] = [
	{ id: "square", icon: <Square className="w-4 h-4" /> },
	{ id: "polygon", icon: <Hexagon className="w-4 h-4" /> },
	{ id: "freehand", icon: <Pencil className="w-4 h-4" /> },
	{ id: "select", icon: <MousePointer2 className="w-4 h-4" /> },
	{ id: "delete", icon: <Trash2 className="w-4 h-4" />, color: "text-red-600" },
];

interface ModeSelectorProps {
	mode: Mode;
	onChange: (mode: Mode) => void;
}
export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
	return (
		<div className="fixed top-1/2 left-4 z-40 flex flex-col gap-2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-2">
			{MODES.map(({ id, icon, color }) => (
				<Button
					key={id}
					variant="outline"
					size="sm"
					onClick={() => onChange(id)}
					className={cn(
						"relative flex items-center justify-center border-0",
						color,
					)}
				>
					{mode === id && (
						<motion.div
							layoutId="active-mode"
							className="absolute inset-0 bg-indigo-200 z-50 dark:bg-blue-700 rounded-md"
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						/>
					)}
					<span className="relative">{icon}</span>
				</Button>
			))}
		</div>
	);
}
