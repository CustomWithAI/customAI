import type { Label, Point, Polygon, Transform } from "@/types/square";
import { useCallback, useState } from "react";

interface UsePolygonOptions {
	onChange?: (polygon: Polygon) => void;
	onComplete?: (polygon: Polygon) => void;
	labels?: Label[];
}

export function usePolygon({
	onChange,
	onComplete,
	labels,
}: UsePolygonOptions = {}) {
	const [polygons, setPolygons] = useState<Polygon[]>([]);
	const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null);
	const [activePolygon, setActivePolygon] = useState<Polygon | null>(null);
	const [previewPoint, setPreviewPoint] = useState<Point | null>(null);
	const [dragState, setDragState] = useState<{
		type: "move" | "resize";
		startPos: Point;
		originalPoints: Point[];
		polygonId: string;
	} | null>(null);

	const startPolygon = useCallback(
		(point: Point, labelId?: string) => {
			const newPolygon: Polygon = {
				id: Date.now().toString(),
				points: [point],
				color: "#000000",
				isComplete: false,
				labelId,
			};
			setActivePolygon(newPolygon);
			setPolygons((prev) => [...prev, newPolygon]);
			onChange?.(newPolygon);
		},
		[onChange],
	);

	const addPoint = useCallback(
		(point: Point) => {
			if (!activePolygon) return;
			const startPoint = activePolygon.points[0];
			const distance = Math.sqrt(
				(point.x - startPoint.x) ** 2 + (point.y - startPoint.y) ** 2,
			);

			if (activePolygon.points.length > 2 && distance < 20) {
				const completedPolygon = {
					...activePolygon,
					isComplete: true,
				};
				setPolygons((prev) =>
					prev.map((p) => (p.id === activePolygon.id ? completedPolygon : p)),
				);
				setActivePolygon(null);
				onComplete?.(completedPolygon);
			} else {
				// Add new point
				const updatedPolygon = {
					...activePolygon,
					points: [...activePolygon.points, point],
				};
				setActivePolygon(updatedPolygon);
				setPolygons((prev) =>
					prev.map((p) => (p.id === activePolygon.id ? updatedPolygon : p)),
				);
				onChange?.(updatedPolygon);
			}
		},
		[activePolygon, onChange, onComplete],
	);

	const startDrag = useCallback(
		(polygonId: string, point: Point, type: "move" | "resize" = "move") => {
			const polygon = polygons.find((p) => p.id === polygonId);
			if (!polygon || polygon.isLocked) return;

			setDragState({
				type,
				startPos: point,
				originalPoints: polygon.points.map((p) => ({ ...p })),
				polygonId,
			});
		},
		[polygons],
	);

	const updateDrag = useCallback(
		(point: Point) => {
			if (!dragState) return;

			setPolygons((prev) =>
				prev.map((polygon) => {
					if (polygon.id !== dragState.polygonId) return polygon;

					const dx = point.x - dragState.startPos.x;
					const dy = point.y - dragState.startPos.y;

					if (dragState.type === "move") {
						return {
							...polygon,
							points: dragState.originalPoints.map((p) => ({
								x: p.x + dx,
								y: p.y + dy,
							})),
						};
					}
					const firstPoint = dragState.originalPoints[0];
					return {
						...polygon,
						points: dragState.originalPoints.map((p) => ({
							x: firstPoint.x + (p.x - firstPoint.x) * (1 + dx / 100),
							y: firstPoint.y + (p.y - firstPoint.y) * (1 + dy / 100),
						})),
					};
				}),
			);
		},
		[dragState],
	);

	const endDrag = useCallback(() => {
		if (dragState) {
			const polygon = polygons.find((p) => p.id === dragState.polygonId);
			if (polygon) {
				onChange?.(polygon);
			}
		}
		setDragState(null);
	}, [dragState, polygons, onChange]);

	const updatePreview = useCallback((point: Point) => {
		setPreviewPoint(point);
	}, []);

	const cancelPolygon = useCallback(() => {
		if (activePolygon) {
			setPolygons((prev) => prev.filter((p) => p.id !== activePolygon.id));
			setActivePolygon(null);
			setPreviewPoint(null);
		}
	}, [activePolygon]);

	const updatePolygon = useCallback(
		(id: string, updates: Partial<Polygon>) => {
			setPolygons((prev) =>
				prev.map((polygon) => {
					if (polygon.id === id) {
						const updated = { ...polygon, ...updates };
						onChange?.(updated);
						return updated;
					}
					return polygon;
				}),
			);
		},
		[onChange],
	);

	const deletePolygon = useCallback((id: string) => {
		setPolygons((prev) => prev.filter((p) => p.id !== id));
	}, []);

	return {
		polygons,
		activePolygon,
		previewPoint,
		startPolygon,
		selectedPolygon,
		setSelectedPolygon,
		addPoint,
		updatePreview,
		cancelPolygon,
		startDrag,
		updateDrag,
		endDrag,
		updatePolygon,
		deletePolygon,
	};
}
