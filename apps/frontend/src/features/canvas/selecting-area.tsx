import type { Point } from "@/types/square";

interface SelectionAreaProps {
	startPoint: Point | null;
	currentPoint: Point | null;
}

export function SelectionArea({
	startPoint,
	currentPoint,
}: SelectionAreaProps) {
	if (!startPoint || !currentPoint) return null;

	const left = Math.min(startPoint.x, currentPoint.x);
	const top = Math.min(startPoint.y, currentPoint.y);
	const width = Math.abs(currentPoint.x - startPoint.x);
	const height = Math.abs(currentPoint.y - startPoint.y);

	return (
		<div
			className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
			style={{
				left,
				top,
				width,
				height,
			}}
		/>
	);
}
