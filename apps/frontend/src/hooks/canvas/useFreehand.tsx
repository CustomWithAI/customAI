import type { FreehandPath, Label, Point, Transform } from "@/types/square";
import { useCallback, useState } from "react";

interface UseFreehandOptions {
	onChange?: (path: FreehandPath) => void;
	onComplete?: (path: FreehandPath) => void;
	labels?: Label[];
}

export function useFreehand({
	onChange,
	onComplete,
	labels,
}: UseFreehandOptions = {}) {
	const [paths, setPaths] = useState<FreehandPath[]>([]);
	const [activePath, setActivePath] = useState<FreehandPath | null>(null);
	const [selectedPath, setSelectedPath] = useState<string | null>(null);
	const [dragState, setDragState] = useState<{
		type: "move" | "resize";
		startPos: Point;
		originalPos: Point[];
		pathId: string;
	} | null>(null);

	const startPath = useCallback(
		(point: Point, labelId?: string) => {
			const newPath: FreehandPath = {
				id: Date.now().toString(),
				points: [point],
				color: "#000000",
				labelId,
			};
			setActivePath(newPath);
			setPaths((prev) => [...prev, newPath]);
			onChange?.(newPath);
		},
		[onChange],
	);

	const addPoint = useCallback(
		(point: Point) => {
			if (!activePath) return;

			const updatedPath = {
				...activePath,
				points: [...activePath.points, point],
			};
			setActivePath(updatedPath);
			setPaths((prev) =>
				prev.map((p) => (p.id === activePath.id ? updatedPath : p)),
			);
			onChange?.(updatedPath);
		},
		[activePath, onChange],
	);

	const endPath = useCallback(() => {
		if (activePath) {
			if (activePath.points.length < 16) {
				setPaths((prev) => prev.slice(0, -1));
				setActivePath(null);
				return;
			}
			const updatedPath = {
				...activePath,
				points: [...activePath.points, activePath.points[0]],
			};
			setPaths((prev) =>
				prev.map((p) => (p.id === activePath.id ? updatedPath : p)),
			);
			onComplete?.(updatedPath);
			setActivePath(null);
		}
	}, [activePath, onComplete]);

	const startDrag = useCallback(
		(pathId: string, point: Point, type: "move" | "resize" = "move") => {
			const path = paths.find((p) => p.id === pathId);
			if (!path || path.isLocked) return;

			setDragState({
				type,
				startPos: point,
				originalPos:
					paths.find((p) => p.id === pathId)?.points.map((p) => ({ ...p })) ||
					[],
				pathId,
			});
		},
		[paths],
	);

	const updateDrag = useCallback(
		(point: Point) => {
			if (!dragState) return;

			setPaths((prev) =>
				prev.map((path) => {
					if (path.id !== dragState.pathId) return path;

					const dx = point.x - dragState.startPos.x;
					const dy = point.y - dragState.startPos.y;

					if (dragState.type === "move") {
						return {
							...path,
							points: dragState.originalPos.map((p) => ({
								x: p.x + dx,
								y: p.y + dy,
							})),
						};
					}
					const firstPoint = dragState.originalPos[0];
					return {
						...path,
						points: dragState.originalPos.map((p) => ({
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
			const path = paths.find((p) => p.id === dragState.pathId);
			if (path) {
				onChange?.(path);
			}
		}
		setDragState(null);
	}, [dragState, paths, onChange]);

	const updatePath = useCallback(
		(id: string, updates: Partial<FreehandPath>) => {
			setPaths((prev) =>
				prev.map((path) => {
					if (path.id === id) {
						const updated = { ...path, ...updates };
						onChange?.(updated);
						return updated;
					}
					return path;
				}),
			);
		},
		[onChange],
	);

	const deletePath = useCallback((id: string) => {
		setPaths((prev) => prev.filter((p) => p.id !== id));
	}, []);

	return {
		paths,
		activePath,
		startPath,
		addPoint,
		endPath,
		selectedPath,
		setSelectedPath,
		startDrag,
		updateDrag,
		endDrag,
		updatePath,
		deletePath,
	};
}
