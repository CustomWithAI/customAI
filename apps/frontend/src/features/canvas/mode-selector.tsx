import { Button } from "@/components/ui/button";
import type { DrawingMode } from "@/types/square";
import { Hexagon, Pencil, Square } from "lucide-react";

interface ModeSelectorProps {
	mode: DrawingMode;
	onChange: (mode: DrawingMode) => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
	return (
		<div className="flex gap-2">
			<Button
				variant={mode === "square" ? "default" : "outline"}
				size="sm"
				onClick={() => onChange("square")}
			>
				<Square className="w-4 h-4 mr-2" />
				Square
			</Button>
			<Button
				variant={mode === "polygon" ? "default" : "outline"}
				size="sm"
				onClick={() => onChange("polygon")}
			>
				<Hexagon className="w-4 h-4 mr-2" />
				Polygon
			</Button>
			<Button
				variant={mode === "freehand" ? "default" : "outline"}
				size="sm"
				onClick={() => onChange("freehand")}
			>
				<Pencil className="w-4 h-4 mr-2" />
				Freehand
			</Button>
		</div>
	);
}
