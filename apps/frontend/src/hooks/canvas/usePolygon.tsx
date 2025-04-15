import type { Label, Point, Polygon, Transform } from "@/types/square";
import { nanoid } from "nanoid";
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
				id: nanoid(),
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

	const movePolygonForward = useCallback((id: string) => {
		setPolygons((prev) => {
			const index = prev.findIndex((p) => p.id === id);
			if (index === -1 || index === prev.length - 1) return prev;

			const newPolygons = [...prev];
			const polygon = newPolygons[index];
			const nextPolygon = newPolygons[index + 1];

			// Swap z-indices if they exist
			if (polygon.zIndex !== undefined && nextPolygon.zIndex !== undefined) {
				const tempZIndex = polygon.zIndex;
				polygon.zIndex = nextPolygon.zIndex;
				nextPolygon.zIndex = tempZIndex;
			} else {
				// If z-indices don't exist, create them based on array position
				polygon.zIndex = index + 1;
				nextPolygon.zIndex = index;
			}

			// Swap positions in array
			newPolygons[index] = nextPolygon;
			newPolygons[index + 1] = polygon;

			return newPolygons;
		});
	}, []);

	const movePolygonBackward = useCallback((id: string) => {
		setPolygons((prev) => {
			const index = prev.findIndex((p) => p.id === id);
			if (index <= 0) return prev;

			const newPolygons = [...prev];
			const polygon = newPolygons[index];
			const prevPolygon = newPolygons[index - 1];

			// Swap z-indices if they exist
			if (polygon.zIndex !== undefined && prevPolygon.zIndex !== undefined) {
				const tempZIndex = polygon.zIndex;
				polygon.zIndex = prevPolygon.zIndex;
				prevPolygon.zIndex = tempZIndex;
			} else {
				// If z-indices don't exist, create them based on array position
				polygon.zIndex = index - 1;
				prevPolygon.zIndex = index;
			}

			// Swap positions in array
			newPolygons[index] = prevPolygon;
			newPolygons[index - 1] = polygon;

			return newPolygons;
		});
	}, []);

	return {
		polygons,
		activePolygon,
		previewPoint,
		startPolygon,
		selectedPolygon,
		setPolygons,
		setSelectedPolygon,
		addPoint,
		updatePreview,
		movePolygonBackward,
		movePolygonForward,
		cancelPolygon,
		startDrag,
		updateDrag,
		endDrag,
		updatePolygon,
		deletePolygon,
	};
}
