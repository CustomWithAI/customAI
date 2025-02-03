import { Badge } from "@/components/ui/badge";
import type {
	FreehandPath,
	Label,
	Point,
	Polygon,
	SelectedShape,
} from "@/types/square";
import { Lock } from "lucide-react";
import type React from "react";
import { type MouseEvent, useState } from "react";

interface ShapeRendererProps {
	polygons: Polygon[];
	freehandPaths: FreehandPath[];
	activePolygon: Polygon | null;
	previewPoint: Point | null;
	selectedShape: SelectedShape;
	labels: Label[];
	onShapeClick: (
		type: "polygon" | "path",
		id: string,
		event: React.MouseEvent,
	) => void;
	onShapeDragStart: (
		type: "polygon" | "path",
		id: string,
		event: React.MouseEvent,
	) => void;
	onContextMenu: (mouse: MouseEvent) => void;
}

export function ShapeRenderer({
	polygons,
	freehandPaths,
	activePolygon,
	previewPoint,
	selectedShape,
	labels,
	onShapeClick,
	onContextMenu,
	onShapeDragStart,
}: ShapeRendererProps) {
	const [hover, setHover] = useState<string | undefined>(undefined);

	const createPathFromPoints = (points: Point[]) => {
		if (points.length === 0) return "";
		return `M ${points[0].x} ${points[0].y} ${points
			.slice(1)
			.map((p) => `L ${p.x} ${p.y}`)
			.join(" ")}`;
	};

	const isSelected = (type: "polygon" | "path", id: string) => {
		return selectedShape?.type === type && selectedShape?.id === id;
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLOrSVGElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			console.log("key clicked");
		}
	};

	return (
		<svg
			className="absolute inset-0"
			width="100%"
			height="100%"
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
			}}
		>
			{/* Render completed polygons */}
			{polygons.map((polygon) => {
				const label = labels.find((l) => l.id === polygon.labelId);
				const selected = isSelected("polygon", polygon.id);
				return (
					<g
						onKeyDown={handleKeyDown}
						key={polygon.id}
						style={{
							cursor: polygon.isLocked
								? "not-allowed"
								: selected
									? "move"
									: "pointer",
						}}
						onContextMenu={onContextMenu}
						onMouseDown={(e) => {
							if (selected && !polygon.isLocked) {
								onShapeDragStart("polygon", polygon.id, e);
							}
						}}
						className={selected ? "selected" : ""}
					>
						<path
							d={
								createPathFromPoints(polygon.points) +
								(polygon.isComplete ? " Z" : "")
							}
							fill={
								polygon.isComplete
									? `${label?.color || polygon.color}40`
									: "none"
							}
							data-shape-id={`polygon-${polygon.id}`}
							stroke={selected ? "#2563eb" : label?.color || polygon.color}
							strokeWidth={selected ? "3" : "2"}
							onMouseEnter={() => setHover(label?.id)}
							onMouseLeave={() => setHover(undefined)}
							strokeDasharray={hover === label?.id || selected ? undefined : 3}
						/>
						{(activePolygon || selected) &&
							previewPoint &&
							!polygon.isLocked &&
							polygon.points.map((point, index) => (
								<circle
									key={index}
									cx={point.x}
									cy={point.y}
									r="4"
									fill="#ffffff"
									stroke={selected ? "#2563eb" : label?.color || polygon.color}
									strokeWidth="2"
								/>
							))}
						{polygon.isComplete && (
							<>
								{label && (
									<foreignObject
										x={polygon.points[0].x + 8}
										y={polygon.points[0].y - 24}
										width="100"
										height="30"
									>
										<Badge
											variant="secondary"
											className="text-xs font-medium"
											style={{
												backgroundColor: label?.color
													? `${label.color}30`
													: "transparent",
											}}
										>
											{label.name}
										</Badge>
									</foreignObject>
								)}
								{polygon.isLocked && (
									<g
										transform={`translate(${polygon.points[0].x - 12}, ${polygon.points[0].y - 12})`}
									>
										<Lock className="w-6 h-6 text-gray-600" />
									</g>
								)}
							</>
						)}
					</g>
				);
			})}

			{/* Render preview line for active polygon */}
			{activePolygon && previewPoint && (
				<line
					x1={activePolygon.points[activePolygon.points.length - 1].x}
					y1={activePolygon.points[activePolygon.points.length - 1].y}
					x2={previewPoint.x}
					y2={previewPoint.y}
					stroke={activePolygon.color}
					strokeWidth="2"
					strokeDasharray="4"
				/>
			)}

			{/* Render freehand paths */}
			{freehandPaths.map((path) => {
				const label = labels.find((l) => l.id === path.labelId);
				const selected = isSelected("path", path.id);
				return (
					<g
						onKeyDown={handleKeyDown}
						key={path.id}
						style={{
							cursor: path.isLocked
								? "not-allowed"
								: selected
									? "move"
									: "pointer",
						}}
						onContextMenu={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onShapeClick("path", path.id, e);
						}}
						onMouseDown={(e) => {
							if (selected && !path.isLocked) {
								onShapeDragStart("path", path.id, e);
							}
						}}
						className={selected ? "selected" : ""}
					>
						<path
							d={createPathFromPoints(path.points)}
							fill={path ? `${label?.color || path.color}40` : "none"}
							stroke={selected ? "#2563eb" : label?.color || path.color}
							data-shape-id={`path-${path.id}`}
							strokeWidth={selected ? "3" : "2"}
							onMouseEnter={() => setHover(label?.id)}
							onMouseLeave={() => setHover(undefined)}
							strokeDasharray={hover === label?.id ? undefined : 3}
						/>
						{label && (
							<foreignObject
								x={path.points[0].x + 8}
								y={path.points[0].y - 24}
								width="100"
								height="30"
							>
								<Badge
									variant="secondary"
									className="text-xs font-medium"
									style={{
										backgroundColor: label?.color
											? `${label.color}30`
											: "transparent",
									}}
								>
									{label.name}
								</Badge>
							</foreignObject>
						)}
						{path.isLocked && (
							<g
								transform={`translate(${path.points[0].x - 12}, ${path.points[0].y - 12})`}
							>
								<Lock className="w-6 h-6 text-gray-600" />
							</g>
						)}
					</g>
				);
			})}
		</svg>
	);
}
