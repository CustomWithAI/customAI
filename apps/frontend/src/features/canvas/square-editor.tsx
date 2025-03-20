"use client";

import { Badge } from "@/components/ui/badge";
import { useFreehand } from "@/hooks/canvas/useFreehand";
import { usePolygon } from "@/hooks/canvas/usePolygon";
import { useSquares } from "@/hooks/canvas/useSquare";
import { cn } from "@/libs/utils";
import type {
	Editor,
	Label,
	Mode,
	Point,
	SelectedShape,
	Square,
} from "@/types/square";
import { darkenColor } from "@/utils/color-utils";
import { fixDecimals } from "@/utils/fixDecimal";
import { getImageSize } from "@/utils/image-size";
import { generateRandomLabel } from "@/utils/random";
import { Lock } from "lucide-react";
import {
	type MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
	editor: Editor;
	initialSquares: Square[];
	type: string;
	image: string;
	initialLabels: Label[];
	onChange?: (updatedEditor: Partial<Editor>) => void;
	mode: Mode;
	onModeChange: (mode: Mode) => void;
}

export default function SquareEditor({
	width = 800,
	height = 600,
	editorId,
	type,
	editor,
	image,
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
	const [size, setSize] = useState<{
		width: number;
		height: number;
	}>({ width: 800, height: 600 });
	const [labels, setLabels] = useState<Label[]>([]);
	const [selectedShape, setSelectedShape] = useState<SelectedShape | null>(
		null,
	);
	const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
	const [shapeContextMenu, setShapeContextMenu] = useState<{
		x: number;
		y: number;
	} | null>(null);

	useEffect(() => {
		getImageSize(image).then((imageSize) => setSize(imageSize));
	}, [image]);

	useEffect(() => {
		setLabels((prevLabels) => {
			const updatedLabels = initialLabels.map((newLabel) => {
				const existingLabel = prevLabels.find(
					(label) => label.name === newLabel.name,
				);
				if (existingLabel) {
					return { ...existingLabel, id: newLabel.id };
				}
				return newLabel;
			});
			return updatedLabels;
		});
	}, [initialLabels]);

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
		onChange?.({ squares, labels });
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
			onChange?.({
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
		deletePath,
	} = useFreehand({
		onChange: (path) => {
			onChange?.({
				freehandPaths: [...freehandPaths.filter((p) => p.id !== path.id), path],
			});
		},
		labels,
	});

	const usedLabelIds = useMemo(() => {
		return [
			editor.classifiedLabel,
			...squares.map((square) => square.labelId),
			...polygons.map((polygon) => polygon.labelId),
			...freehandPaths.map((path) => path.labelId),
		].filter(Boolean) as string[];
	}, [freehandPaths, polygons, squares, editor.classifiedLabel]);

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

	const handleShapeClick = useCallback(
		(type: "polygon" | "path", id: string, event: React.MouseEvent) => {
			event.stopPropagation();
			if (event.button === 2 && event.type === "contextmenu") {
				setSelectedShape({ type, id });
				setShapeContextMenu({ x: event.clientX, y: event.clientY });
			} else if (selectedShape) {
				setSelectedShape(null);
			} else {
				setSelectedShape((prev) => (prev?.id === id ? null : { type, id }));
			}
		},
		[selectedShape],
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
				case "delete": {
					const deleteTarget = event.target as Element;
					const deleteElement = deleteTarget.closest("[data-square-id], path");
					if (!deleteElement) return;
					if (deleteElement.hasAttribute("data-square-id")) {
						const squareId = deleteElement.getAttribute("data-square-id");
						if (squareId) deleteSquare(squareId);
					} else {
						const pathData = deleteElement.getAttribute("data-shape-id");
						if (!pathData) return;
						const [type, id] = pathData.split("-");
						if (type === "polygon") {
							deletePolygon(id);
						} else if (type === "path") {
							deletePath(id);
						}
					}
					break;
				}
				case "polygon": {
					if ((event.target as Element).closest("[data-shape-id]")) {
						const shapeElement = (event.target as Element).closest(
							"[data-shape-id]",
						);
						if (!shapeElement?.hasAttribute("data-shape-id")) return;
						const shapeId = shapeElement.getAttribute("data-shape-id");
						if (!shapeId) return;
						const [type, id] = shapeId.split("-");
						const polygon = polygons.find((p) => p.id === id);
						if (polygon) {
							setSelectedShape({ type: type as "polygon" | "path", id });
							if (!polygon.isLocked) {
								startPolygonDrag(id, { x, y });
							}
							return;
						}
					}
					if (!selectedShape && !activePolygon) {
						if (!unusedLabel) return;
						startPolygon({ x, y }, unusedLabel.id);
					} else if (activePolygon) {
						addPoint({ x, y });
					}
					setSelectedShape(null);
					break;
				}
				case "freehand": {
					if ((event.target as Element).closest("[data-shape-id]")) {
						const shapeElement = (event.target as Element).closest(
							"[data-shape-id]",
						);
						if (!shapeElement?.hasAttribute("data-shape-id")) return;
						const shapeId = shapeElement.getAttribute("data-shape-id");
						if (!shapeId) return;
						const [type, id] = shapeId.split("-");
						const path = freehandPaths.find((p) => p.id === id);
						if (path) {
							setSelectedShape({ type: type as "polygon" | "path", id });
							if (!path.isLocked) {
								startPathDrag(id, { x, y });
							}
							return;
						}
					}
					if (!selectedShape) {
						if (!unusedLabel) return;
						startPath({ x, y }, unusedLabel.id);
					}
					setSelectedShape(null);
					break;
				}
				default: {
					console.log("not implemented");
				}
			}
		},
		[
			mode,
			deletePolygon,
			deleteSquare,
			freehandPaths,
			startPolygonDrag,
			polygons,
			squares,
			activePolygon,
			startPathDrag,
			addPoint,
			deletePath,
			selectedShape,
			startPath,
			startPolygon,
			handleStartDrag,
			setSelectedSquare,
			getMousePosition,
			getUnusedLabel,
		],
	);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent) => {
			const { x, y } = getMousePosition(event);
			switch (mode) {
				case "square":
					updateDrag(x, y);
					break;
				case "polygon":
					updatePreview({ x, y });
					if (!activePolygon) {
						updatePolygonDrag({ x, y });
					}
					break;
				case "freehand":
					if (activePath) {
						addFreehandPoint({ x, y });
					}
					break;
			}
		},
		[
			updateDrag,
			updatePreview,
			activePath,
			mode,
			activePolygon,
			updatePolygonDrag,
			addFreehandPoint,
			getMousePosition,
		],
	);

	const handleMouseUp = useCallback(
		(event: MouseEvent) => {
			if (event.button === 2) return;
			switch (mode) {
				case "square":
					endDrag();
					break;
				case "polygon":
					endPolygonDrag();
					break;
				case "freehand":
					if (activePath) {
						endPath();
						break;
					}
					endPathDrag();
					break;
			}
		},
		[mode, endDrag, endPolygonDrag, activePath, endPath, endPathDrag],
	);

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
				return;
			}

			const shapeElement = targetElement?.closest("[data-shape-id]");
			if (shapeElement) {
				const shapeId = shapeElement.getAttribute("data-shape-id");
				if (shapeId) {
					event.stopPropagation();
					const [type, id] = shapeId.split("-");
					setSelectedShape({ type: type as "polygon" | "path", id: id });
					setShapeContextMenu({ x: event.clientX, y: event.clientY });
				}
				return;
			}
		},
		[setSelectedSquare],
	);

	const handleExport = useCallback(() => {
		const data = {
			squares: squares.map(
				({ id, x, y, width, height, labelId, zIndex, isLocked }) => ({
					id,
					x: fixDecimals(x),
					y: fixDecimals(y),
					width: fixDecimals(width),
					height: fixDecimals(height),
					labelId,
					zIndex,
					isLocked,
				}),
			),
			polygons: polygons.map(
				({ id, points, color, labelId, zIndex, isLocked }) => ({
					id,
					points: points.map(({ x, y }) => ({
						x: fixDecimals(x),
						y: fixDecimals(y),
					})),
					color,
					labelId,
					zIndex,
					isLocked,
				}),
			),
			paths: freehandPaths.map(
				({ id, points, color, labelId, zIndex, isLocked }) => ({
					id,
					points: points.map(({ x, y }) => ({
						x: fixDecimals(x),
						y: fixDecimals(y),
					})),
					color,
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
		link.download = "annotate.json";
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
				data.labels?.map((label: Label) => ({
					id: label.id,
					name: label.name,
					color: label.color,
				})),
			);
			if (Array.isArray(data?.squares)) {
				for (const square of data.square) {
					const { id, property } = square;
					updateSquare(id, {
						...property,
					});
				}
			}
			if (Array.isArray(data?.polygons)) {
				for (const polygon of data.polygons) {
					const { id, property } = polygon;
					updatePolygon(id, {
						...property,
					});
				}
			}
			if (Array.isArray(data?.paths)) {
				for (const path of data.paths) {
					const { id, property } = path;
					updatePath(id, {
						...property,
					});
				}
			}
			onChange?.({
				squares: data?.squares,
				labels: data?.labels,
				polygons: data?.polygon,
				freehandPaths: data?.paths,
			});
		},
		[updateSquare, onChange, updatePolygon, updatePath],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (
				event.key === "Backspace" &&
				!["INPUT", "TEXTAREA"].includes(target.tagName)
			) {
				event.preventDefault();
				if (selectedShape) {
					if (selectedShape.type === "polygon") {
						deletePolygon(selectedShape.id);
					}
					if (selectedShape.type === "path") {
						deletePath(selectedShape.id);
					}
					setShapeContextMenu(null);
					setSelectedShape(null);
				}
				if (!selectedSquare) return;
				deleteSquare(selectedSquare);
				setContextMenu(null);
			}
			if (event.key === "Escape") {
				if (mode === "polygon") {
					cancelPolygon();
				}
				if (mode === "freehand") {
					endPath();
				}
			}
		},
		[
			deleteSquare,
			selectedSquare,
			deletePath,
			deletePolygon,
			selectedShape,
			cancelPolygon,
			endPath,
			mode,
		],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	const handleAddLabel = useCallback(() => {
		const { name, color } = generateRandomLabel();
		const newLabel: Label = {
			id: Date.now().toString(),
			name,
			color,
		};
		setLabels((prev) => {
			const updated = [...prev, newLabel];
			onChange?.({ labels: updated });
			return updated;
		});
		return newLabel;
	}, [onChange]);

	const handleRemoveLabel = useCallback(
		(labelId: string) => {
			setLabels((prev) => {
				const updated = prev.filter((label) => label.id !== labelId);
				onChange?.({ labels: updated });
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
					case "select": {
						setSelectedShape(null);
						setContextMenu(null);
						setShapeContextMenu(null);
						break;
					}
					case "square": {
						if (shape?.id) {
							setSelectedSquare(shape?.id);
							setSelectedShape(null);
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
							setSelectedSquare(null);
							setContextMenu(null);
							setShapeContextMenu(null);
						}
						break;
					}
				}
				return;
			}
			if (mode === "select") {
				onChange?.({
					classifiedLabel: labelId,
				});
			}
			updateLabel(selectedSquare, labelId, updateSquare);
			updateLabel(selectedPolygon, labelId, updatePolygon);
			updateLabel(selectedPath, labelId, updatePath);
		},
		[
			selectedSquare,
			findShapeById,
			onChange,
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
				onChange?.({ labels: updated });
				return updated;
			});
		},
		[onChange],
	);

	const visibleSquares = squares.filter((square) => {
		if (!selectedLabel) return true;
		return square.labelId === selectedLabel;
	});

	const classifiedLabel = labels.find((l) => l.id === editor.classifiedLabel);

	return (
		<div className="flex w-full h-full">
			<ModeSelector
				type={type}
				mode={mode}
				onChange={onModeChange}
				editorId={editorId}
				handleExport={handleExport}
				handleImport={handleImport}
			/>
			<div
				className={cn(
					"flex-1 space-y-4 p-36",
					"[background-size:20px_20px]",
					"[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
					"dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
				)}
			>
				<div className="relative w-full h-full flex items-center justify-center">
					<div
						ref={containerRef}
						style={{
							width: size?.width,
							height: size?.height,
							backgroundImage: `url(${image})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
						className="relative border rounded-sm shadow-md bg-white border-gray-300"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						onContextMenu={handleContextMenu}
					>
						{classifiedLabel ? (
							<Badge
								variant="secondary"
								className="absolute -translate-y-full z-99 -top-1 text-white left-0"
								style={{
									backgroundColor: classifiedLabel?.color
										? `${classifiedLabel.color}90`
										: "transparent",
								}}
							>
								{classifiedLabel?.name}
							</Badge>
						) : null}
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
											className="absolute -translate-y-full -top-1 text-white left-0 text-xs font-medium"
											style={{
												backgroundColor: label?.color
													? `${label.color}90`
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
							onContextMenu={handleContextMenu}
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
