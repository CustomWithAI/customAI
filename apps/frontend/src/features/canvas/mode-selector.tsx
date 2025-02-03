import { Button } from "@/components/ui/button";
import type { Mode } from "@/types/square";
import { Hexagon, MousePointer2, Pencil, Square, Trash2 } from "lucide-react";

interface ModeSelectorProps {
	mode: Mode;
	onChange: (mode: Mode) => void;
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
			<Button
				variant={mode === "select" ? "default" : "outline"}
				size="sm"
				onClick={() => onChange("select")}
			>
				<MousePointer2 className="w-4 h-4 mr-2" />
				Select
			</Button>
			<Button
				variant={mode === "delete" ? "default" : "outline"}
				size="sm"
				onClick={() => onChange("delete")}
				className="text-red-600"
			>
				<Trash2 className="w-4 h-4 mr-2" />
				Delete
			</Button>
		</div>
	);
}
