"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFreehand } from "@/hooks/canvas/useFreehand";
import { usePolygon } from "@/hooks/canvas/usePolygon";
import { useSquares } from "@/hooks/canvas/useSquare";
import { cn } from "@/libs/utils";
import type { DrawingMode, Label, SelectedShape, Square } from "@/types/square";
import { darkenColor } from "@/utils/color-utils";
import { generateRandomLabel } from "@/utils/random";
import { Download, Upload } from "lucide-react";
import { Lock } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContextMenu } from "./context-menu";
import { LabelSidebar } from "./label-sidebar";
import { removeLabelFromShapes, updateLabel } from "./label-utils";
import { ModeSelector } from "./mode-selector";
import { ShapeContextMenu } from "./shape-context-menu";
import { ShapeRenderer } from "./shape-render";

interface SquareEditorProps {
	width?: number;
	height?: number;
	editorId: string;
	initialSquares: Square[];
	initialLabels: Label[];
	onChange?: (squares: Square[], labels: Label[]) => void;
	mode: DrawingMode;
	onModeChange: (mode: DrawingMode) => void;
}

export default function SquareEditor({
	width = 800,
	height = 600,
	editorId,
	initialSquares,
	initialLabels,
	onChange,
	mode,
	onModeChange,
}: SquareEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [labels, setLabels] = useState<Label[]>(initialLabels);
	const [selectedShape, setSelectedShape] = useState<SelectedShape | null>(
		null,
	);
	const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
	const [shapeContextMenu, setShapeContextMenu] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const {
		squares,
		selectedSquare,
		setSquares,
		setSelectedSquare,
		startDrag,
		updateDrag,
		endDrag,
		deleteSquare,
		updateSquare,
		moveSquareForward,
		moveSquareBackward,
	} = useSquares((square) => {
		onChange?.(squares, labels);
	});

	useEffect(() => {
		setSquares(initialSquares);
	}, [initialSquares, setSquares]);

	const {
		polygons,
		activePolygon,
		selectedPolygon,
		previewPoint,
		startPolygon,
		addPoint,
		updatePreview,
		cancelPolygon,
		startDrag: startPolygonDrag,
		updateDrag: updatePolygonDrag,
		endDrag: endPolygonDrag,
		updatePolygon,
		setSelectedPolygon,
		deletePolygon,
	} = usePolygon({
		onChange: (polygon) => {
			handleEditorChange(editorId, {
				polygons: [...polygons.filter((p) => p.id !== polygon.id), polygon],
			});
		},
		labels,
	});

	const {
		paths: freehandPaths,
		activePath,
		selectedPath,
		startPath,
		addPoint: addFreehandPoint,
		endPath,
		startDrag: startPathDrag,
		updateDrag: updatePathDrag,
		endDrag: endPathDrag,
		updatePath,
		setSelectedPath,
		deletePath,
	} = useFreehand({
		onChange: (path) => {
			handleEditorChange(editorId, {
				freehandPaths: [...freehandPaths.filter((p) => p.id !== path.id), path],
			});
		},
		labels,
	});

	const usedLabelIds = useMemo(() => {
		return [
			...squares.map((square) => square.labelId),
			...polygons.map((polygon) => polygon.labelId),
			...freehandPaths.map((path) => path.labelId),
		].filter(Boolean) as string[];
	}, [freehandPaths, polygons, squares]);

	const findShapeById = useCallback(
		(labelId: string) => {
			switch (mode) {
				case "square":
					return squares.find((square) => square.labelId === labelId);
				case "polygon":
					return polygons.find((polygon) => polygon.labelId === labelId);
				case "freehand":
					return freehandPaths.find((path) => path.labelId === labelId);
			}
		},
		[freehandPaths, polygons, squares, mode],
	);

	const getMousePosition = useCallback((event: React.MouseEvent) => {
		const container = containerRef.current;
		if (!container) return { x: 0, y: 0 };

		const rect = container.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}, []);

	const getUnusedLabel = useCallback(() => {
		return labels.find((label) => !usedLabelIds.includes(label.id));
	}, [labels, usedLabelIds]);

	const isUsedLabel = useCallback(
		(id: string) => {
			return !!usedLabelIds.find((label) => label === id);
		},
		[usedLabelIds],
	);

	const handleStartDrag = useCallback(
		(x: number, y: number, existingSquare?: Square, corner?: string) => {
			if (!existingSquare) {
				const unusedLabel = getUnusedLabel();
				if (unusedLabel) {
					startDrag(
						x,
						y,
						undefined,
						corner as "top-left" | "top-right" | "bottom-left" | "bottom-right",
					);
					const newSquareId = Date.now().toString();
					setTimeout(() => {
						updateSquare(newSquareId, { labelId: unusedLabel.id });
					}, 0);
				}
			} else {
				startDrag(
					x,
					y,
					existingSquare,
					corner as "top-left" | "top-right" | "bottom-left" | "bottom-right",
				);
			}
		},
		[startDrag, getUnusedLabel, updateSquare],
	);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			if (event.button !== 0) return;

			const unusedLabel = getUnusedLabel() || handleAddLabel();
			const { x, y } = getMousePosition(event);

			switch (mode) {
				case "square": {
					if (
						!unusedLabel &&
						!(event.target as Element).closest("[data-square-id]")
					) {
						return;
					}
					const targetElement = document.elementFromPoint(
						event.clientX,
						event.clientY,
					);
					if (targetElement?.classList.contains("resize-handle")) {
						const squareElement = targetElement.closest("[data-square-id]");
						const cornerType = targetElement.getAttribute("data-corner") as
							| "top-left"
							| "top-right"
							| "bottom-left"
							| "bottom-right";

						if (squareElement && cornerType) {
							const squareId = squareElement.getAttribute("data-square-id");
							const square = squares.find((s) => s.id === squareId);
							if (square && !square.isLocked) {
								event.stopPropagation();
								handleStartDrag(x, y, square, cornerType);
								return;
							}
						}
					}
					const squareElement = (event.target as Element).closest(
						"[data-square-id]",
					);
					if (squareElement) {
						const squareId = squareElement.getAttribute("data-square-id");
						const square = squares.find((s) => s.id === squareId);
						if (square) {
							setSelectedSquare(square.id);
							if (!square.isLocked) {
								handleStartDrag(x, y, square);
							}
							return;
						}
					}

					setSelectedSquare(null);
					handleStartDrag(x, y);
					break;
				}
				case "polygon": {
					if (!selectedShape && !activePolygon) {
						if (!unusedLabel) return;
						startPolygon({ x, y }, unusedLabel.id);
					} else if (activePolygon) {
						addPoint({ x, y });
					}
					break;
				}
				case "freehand": {
					if (!selectedShape) {
						if (!unusedLabel) return;
						startPath({ x, y }, unusedLabel.id);
					}
					break;
				}
			}
		},
		[
			activePolygon,
			addPoint,
			mode,
			selectedShape,
			startPath,
			startPolygon,
			squares,
			handleStartDrag,
			setSelectedSquare,
			getMousePosition,
			getUnusedLabel,
		],
	);

	const handlePolygonMouseDown = useCallback(
		(id: string, event: React.MouseEvent) => {
			if (event.button !== 0) return;
			const { x, y } = getMousePosition(event);
			startPolygonDrag(id, { x, y });
		},
		[startPolygonDrag, getMousePosition],
	);

	const handlePathMouseDown = useCallback(
		(id: string, event: React.MouseEvent) => {
			if (event.button !== 0) return;
			const { x, y } = getMousePosition(event);
			startPathDrag(id, { x, y });
		},
		[startPathDrag, getMousePosition],
	);

	const handleEditorChange = useCallback(
		(
			editorId: string,
			updates: Partial<{
				squares: Square[];
				labels: Label[];
				polygons: { id: string; points: { x: number; y: number }[] }[];
				freehandPaths: { id: string; points: { x: number; y: number }[] }[];
			}>,
		) => {
			onChange?.(
				[...squares, ...(updates.squares || [])],
				[...labels, ...(updates.labels || [])],
			);
		},
		[onChange, squares, labels],
	);

	const handleShapeClick = useCallback(
		(type: "polygon" | "path", id: string, event: React.MouseEvent) => {
			event.stopPropagation();
			if (event.button === 2 || event.type === "contextmenu") {
				setSelectedShape({ type, id });
				setShapeContextMenu({ x: event.clientX, y: event.clientY });
			} else {
				setSelectedShape((prev) => (prev?.id === id ? null : { type, id }));
			}
		},
		[],
	);

	const handleShapeDragStart = useCallback(
		(type: "polygon" | "path", id: string, event: React.MouseEvent) => {
			event.stopPropagation();
			const { x, y } = getMousePosition(event);
			if (type === "polygon") {
				startPolygonDrag(id, { x, y });
			} else {
				startPathDrag(id, { x, y });
			}
		},
		[getMousePosition, startPolygonDrag, startPathDrag],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (
				event.key === "Backspace" &&
				!["INPUT", "TEXTAREA"].includes(target.tagName)
			) {
				event.preventDefault();
				if (!selectedSquare) return;
				deleteSquare(selectedSquare);
				setContextMenu(null);
			}
			if (event.key === "Escape") {
				if (mode === "polygon") {
					cancelPolygon();
				}
			}
		},
		[deleteSquare, selectedSquare, cancelPolygon, mode],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent) => {
			const { x, y } = getMousePosition(event);
			switch (mode) {
				case "square":
					updateDrag(x, y);
					break;
				case "polygon":
					if (activePolygon) {
						updatePreview({ x, y });
					} else if (selectedPolygon) {
						updatePolygonDrag({ x, y });
					}
					break;
				case "freehand":
					if (activePath) {
						addFreehandPoint({ x, y });
					} else if (selectedPath) {
						updatePathDrag({ x, y });
					}
					break;
			}
		},
		[
			updateDrag,
			updatePreview,
			activePath,
			activePolygon,
			selectedPath,
			selectedPolygon,
			updatePathDrag,
			updatePolygonDrag,
			mode,
			addFreehandPoint,
			getMousePosition,
		],
	);

	const handleMouseUp = useCallback(() => {
		switch (mode) {
			case "square":
				endDrag();
				break;
			case "polygon":
				if (selectedPolygon) {
					endPolygonDrag();
				}
				break;
			case "freehand":
				if (activePath) {
					endPath();
				} else if (selectedPath) {
					endPathDrag();
				}
				break;
		}
	}, [
		mode,
		endDrag,
		selectedPolygon,
		endPolygonDrag,
		activePath,
		endPath,
		selectedPath,
		endPathDrag,
	]);

	const handleContextMenu = useCallback(
		(event: React.MouseEvent) => {
			event.preventDefault();
			const targetElement = document.elementFromPoint(
				event.clientX,
				event.clientY,
			);
			const squareElement = targetElement?.closest("[data-square-id]");

			if (squareElement) {
				const squareId = squareElement.getAttribute("data-square-id");
				if (squareId) {
					setSelectedSquare(squareId);
					setContextMenu({ x: event.clientX, y: event.clientY });
				}
			}
		},
		[setSelectedSquare],
	);

	const handleExport = useCallback(() => {
		const data = {
			squares: squares.map(
				({ id, x, y, width, height, labelId, zIndex, isLocked }) => ({
					id,
					x: Math.round(x),
					y: Math.round(y),
					width: Math.round(width),
					height: Math.round(height),
					labelId,
					zIndex,
					isLocked,
				}),
			),
			polygon: polygons.map(
				({ id, points, color, labelId, zIndex, isLocked, transform }) => ({
					id,
					points: points.map(({ x, y }) => ({
						x: Math.round(x),
						y: Math.round(y),
					})),
					color,
					transform,
					labelId,
					zIndex,
					isLocked,
				}),
			),
			path: freehandPaths.map(
				({ id, points, color, labelId, zIndex, isLocked, transform }) => ({
					id,
					points: points.map(({ x, y }) => ({
						x: Math.round(x),
						y: Math.round(y),
					})),
					color,
					transform,
					labelId,
					zIndex,
					isLocked,
				}),
			),
			labels,
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "squares.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, [squares, labels, polygons, freehandPaths]);

	const handleImport = useCallback(
		(json: string | object) => {
			const data = typeof json === "string" ? JSON.parse(json) : json;
			if (!Array.isArray(data.squares) || !Array.isArray(data.labels)) {
				throw new Error("Invalid file format");
			}
			setLabels([]);
			setLabels(
				data.labels.map((label: Label) => ({
					id: label.id,
					name: label.name,
					color: label.color,
				})),
			);
			for (const square of data.square) {
				updateSquare(square.id, {
					x: square.x,
					y: square.y,
					width: square.width,
					height: square.height,
					labelId: square.labelId,
					zIndex: square.zIndex,
					isLocked: square.isLocked,
				});
			}
			onChange?.(data.squares, data.labels);
		},
		[updateSquare, onChange],
	);

	const handleAddLabel = useCallback(() => {
		const { name, color } = generateRandomLabel();
		const newLabel: Label = {
			id: Date.now().toString(),
			name,
			color,
		};
		setLabels((prev) => {
			const updated = [...prev, newLabel];
			onChange?.(squares, updated);
			return updated;
		});
		return newLabel;
	}, [onChange, squares]);

	const handleRemoveLabel = useCallback(
		(labelId: string) => {
			setLabels((prev) => {
				const updated = prev.filter((label) => label.id !== labelId);
				onChange?.(squares, updated);
				return updated;
			});
			setSelectedLabel((prev) => (prev === labelId ? null : prev));

			removeLabelFromShapes(squares, labelId, updateSquare);
			removeLabelFromShapes(polygons, labelId, updatePolygon);
			removeLabelFromShapes(freehandPaths, labelId, updatePath);
		},
		[
			squares,
			updateSquare,
			polygons,
			updatePolygon,
			freehandPaths,
			updatePath,
			onChange,
		],
	);

	const handleLabelClick = useCallback(
		(labelId: string) => {
			if (isUsedLabel(labelId)) {
				const shape = findShapeById(labelId);
				switch (mode) {
					case "square": {
						if (shape?.id) {
							setSelectedSquare(shape?.id);
							setContextMenu(null);
							setShapeContextMenu(null);
						}
						break;
					}
					case "polygon":
					case "freehand": {
						if (shape?.id) {
							setSelectedShape({
								type: mode === "freehand" ? "path" : "polygon",
								id: shape?.id,
							});
							setContextMenu(null);
							setShapeContextMenu(null);
						}
						break;
					}
				}
				return;
			}

			updateLabel(selectedSquare, labelId, updateSquare);
			updateLabel(selectedPolygon, labelId, updatePolygon);
			updateLabel(selectedPath, labelId, updatePath);
		},
		[
			selectedSquare,
			findShapeById,
			mode,
			setSelectedSquare,
			isUsedLabel,
			updateSquare,
			updatePolygon,
			selectedPath,
			selectedPolygon,
			updatePath,
		],
	);

	const handleUpdateLabel = useCallback(
		(updatedLabel: Label) => {
			setLabels((prev) => {
				const updated = prev.map((label) =>
					label.id === updatedLabel.id ? updatedLabel : label,
				);
				onChange?.(squares, updated);
				return updated;
			});
		},
		[onChange, squares],
	);

	const visibleSquares = squares.filter((square) => {
		if (!selectedLabel) return true;
		return square.labelId === selectedLabel;
	});

	return (
		<div className="flex w-full h-full">
			<div className="flex-1 space-y-4">
				<div className="flex justify-between items-center px-6">
					<ModeSelector mode={mode} onChange={onModeChange} />
					<div className="flex gap-2">
						<Button onClick={handleExport} variant="outline" size="sm">
							<Download className="w-4 h-4 mr-2" />
							Export JSON
						</Button>
						<Button
							onClick={() =>
								document.getElementById(`import-json-${editorId}`)?.click()
							}
							variant="outline"
							size="sm"
						>
							<Upload className="w-4 h-4 mr-2" />
							Import JSON
						</Button>
						<input
							id={`import-json-${editorId}`}
							type="file"
							accept=".json"
							onChange={handleImport}
							className="hidden"
						/>
					</div>
				</div>
				<div className="relative w-full h-full flex dark:bg-dot-white/[0.2] bg-dot-black/[0.2] items-center justify-center">
					<div
						ref={containerRef}
						style={{ width, height }}
						className="relative border rounded-md shadow-md bg-white border-gray-300 overflow-hidden"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						onContextMenu={handleContextMenu}
					>
						{visibleSquares.map((square) => {
							const label = labels.find((l) => l.id === square.labelId);
							return (
								<div
									key={square.id}
									data-square-id={square.id}
									className={cn(
										"absolute border-2 hover:contrast-150 border-dashed hover:border-solid rounded-md bg-opacity-65 duration-150",
										` ${
											square.id === selectedSquare
												? "border-blue-500"
												: "border-black"
										} ${square.isLocked ? "cursor-not-allowed" : "cursor-move"}`,
									)}
									style={{
										left: Math.max(0, square.x),
										top: Math.max(0, square.y),
										width: Math.max(0, square.width),
										height: Math.max(0, square.height),
										transform: `translate(${square.width < 0 ? "100%" : "0"}, ${square.height < 0 ? "100%" : "0"})`,
										backgroundColor: label?.color
											? `${label.color}50`
											: "transparent",
										borderColor: label?.color
											? darkenColor(label.color, 20)
											: "#4c4c4c",
										zIndex: (square.zIndex || 0) + 1,
									}}
								>
									{label && (
										<Badge
											variant="secondary"
											className="absolute -top-7 left-0 text-xs font-medium"
											style={{
												backgroundColor: label?.color
													? `${label.color}30`
													: "transparent",
											}}
										>
											{label.name}
										</Badge>
									)}
									{square.isLocked && (
										<div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
											<Lock className="w-6 h-6 text-gray-600" />
										</div>
									)}
									{square.id === selectedSquare && !square.isLocked && (
										<>
											<div
												className="resize-handle absolute w-3 h-3 -left-1.5 -top-1.5 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize z-10"
												data-corner="top-left"
											/>
											<div
												className="resize-handle absolute w-3 h-3 -right-1.5 -top-1.5 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize z-10"
												data-corner="top-right"
											/>
											<div
												className="resize-handle absolute w-3 h-3 -left-1.5 -bottom-1.5 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize z-10"
												data-corner="bottom-left"
											/>
											<div
												className="resize-handle absolute w-3 h-3 -right-1.5 -bottom-1.5 bg-white border-2 border-blue-500 rounded-full cursor-se-resize z-10"
												data-corner="bottom-right"
											/>
										</>
									)}
								</div>
							);
						})}
						<ShapeRenderer
							polygons={polygons}
							freehandPaths={freehandPaths}
							activePolygon={activePolygon}
							previewPoint={previewPoint}
							selectedShape={selectedShape}
							labels={labels}
							onShapeClick={handleShapeClick}
							onShapeDragStart={handleShapeDragStart}
						/>
					</div>
					{contextMenu && selectedSquare && (
						<ContextMenu
							x={contextMenu.x}
							y={contextMenu.y}
							labels={labels}
							square={squares.find((s) => s.id === selectedSquare)}
							onDelete={() => {
								deleteSquare(selectedSquare);
								setContextMenu(null);
							}}
							onClose={() => setContextMenu(null)}
							onUpdate={(updates) => {
								updateSquare(selectedSquare, updates);
							}}
							onMoveForward={() => moveSquareForward(selectedSquare)}
							onMoveBackward={() => moveSquareBackward(selectedSquare)}
						/>
					)}
					{shapeContextMenu && selectedShape && (
						<ShapeContextMenu
							x={shapeContextMenu.x}
							y={shapeContextMenu.y}
							shape={
								selectedShape.type === "polygon"
									? polygons.find((p) => p.id === selectedShape.id)
									: freehandPaths.find((p) => p.id === selectedShape.id)
							}
							labels={labels}
							onDelete={() => {
								if (selectedShape.type === "polygon") {
									deletePolygon(selectedShape.id);
								} else {
									deletePath(selectedShape.id);
								}
								setSelectedShape(null);
								setShapeContextMenu(null);
							}}
							onClose={() => setShapeContextMenu(null)}
							onUpdate={(updates) => {
								if (selectedShape.type === "polygon") {
									updatePolygon(selectedShape.id, updates);
								} else {
									updatePath(selectedShape.id, updates);
								}
							}}
							onMoveForward={() => {
								// Implement z-index handling
							}}
							onMoveBackward={() => {
								// Implement z-index handling
							}}
						/>
					)}
				</div>
			</div>
			<LabelSidebar
				labels={labels}
				onAddLabel={handleAddLabel}
				onRemoveLabel={handleRemoveLabel}
				onLabelClick={handleLabelClick}
				onUpdateLabel={handleUpdateLabel}
				selectedLabel={selectedLabel ?? undefined}
				usedLabels={usedLabelIds}
			/>
		</div>
	);
}
