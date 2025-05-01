"use client";

import { Badge } from "@/components/ui/badge";
import { useFreehand } from "@/hooks/canvas/useFreehand";
import { usePolygon } from "@/hooks/canvas/usePolygon";
import { useSquares } from "@/hooks/canvas/useSquare";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Undefined } from "@/libs/Undefined";
import { cn } from "@/libs/utils";
import type {
	Editor,
	Label,
	Mode,
	Point,
	Polygon,
	SelectedShape,
	Square,
} from "@/types/square";
import { darkenColor } from "@/utils/color-utils";
import { fixDecimals } from "@/utils/fixDecimal";
import { getImageSize } from "@/utils/image-size";
import { generateRandomLabel } from "@/utils/random";
import { Lock } from "lucide-react";
import { nanoid } from "nanoid";
import {
	type MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { CanvasSidebar } from "./canvasSidebar";
import { ContextMenu } from "./context-menu";
import { LabelSidebar } from "./label-sidebar";
import { removeLabelFromShapes, updateLabel } from "./label-utils";
import { ModeSelector } from "./mode-selector";
import { ResizeHandler } from "./resize-handler";
import { ShapeContextMenu } from "./shape-context-menu";
import { ShapeRenderer } from "./shape-render";

interface SquareEditorProps {
	width?: number;
	height?: number;
	editorId: string;
	editor: Editor;
	initialSquares: Square[];
	initialPolygons: Polygon[];
	type: string;
	image: string;
	onLoad?: boolean;
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
	onLoad,
	initialPolygons,
	image,
	initialSquares,
	initialLabels = [],
	onChange,
	mode,
	onModeChange,
}: SquareEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
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
	const [zoom, setZoom] = useState<number>(1);
	const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize();

	useEffect(() => {
		if (!image) return;
		getImageSize(image).then((imageSize) => setSize(imageSize));
	}, [image]);

	useEffect(() => {
		if (!initialLabels) return;
		setLabels((prevLabels) => {
			const updatedLabels =
				initialLabels?.map((newLabel) => {
					const existingLabel = prevLabels.find(
						(label) => label.name === newLabel.name,
					);
					if (existingLabel) {
						return { ...existingLabel, id: newLabel.id };
					}
					return newLabel;
				}) || [];
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
		onChange?.({
			squares: Array.isArray(square)
				? square
				: [...squares.filter((p) => p.id !== square.id), square],
			labels,
		});
	});

	useEffect(() => {
		setSquares(initialSquares);
	}, [initialSquares, setSquares]);

	const {
		polygons,
		activePolygon,
		selectedPolygon,
		setPolygons,
		previewPoint,
		startPolygon,
		addPoint,
		updatePreview,
		cancelPolygon,
		movePolygonBackward,
		movePolygonForward,
		startDrag: startPolygonDrag,
		updateDrag: updatePolygonDrag,
		endDrag: endPolygonDrag,
		updatePolygon,
		setSelectedPolygon,
		deletePolygon,
	} = usePolygon({
		onChange: (polygon) => {
			onChange?.({
				polygons: Array.isArray(polygon)
					? polygon
					: [...polygons.filter((p) => p.id !== polygon.id), polygon],
			});
		},
		labels,
	});

	useEffect(() => {
		setPolygons(initialPolygons);
	}, [initialPolygons, setPolygons]);

	const {
		paths: freehandPaths,
		activePath,
		selectedPath,
		startPath,
		addPoint: addFreehandPoint,
		endPath,
		movePathBackward,
		movePathForward,
		startDrag: startPathDrag,
		updateDrag: updatePathDrag,
		endDrag: endPathDrag,
		setSelectedPath,
		updatePath,
		deletePath,
	} = useFreehand({
		onChange: (path) => {
			onChange?.({
				freehandPaths: Array.isArray(path)
					? path
					: [...freehandPaths.filter((p) => p.id !== path.id), path],
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
		].filter(Undefined) as string[];
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

	const getMousePosition = useCallback(
		(event: React.MouseEvent) => {
			const container = containerRef.current;
			if (!container) return { x: 0, y: 0 };

			const rect = container.getBoundingClientRect();
			return {
				x: (event.clientX - rect.left) / zoom,
				y: (event.clientY - rect.top) / zoom,
			};
		},
		[zoom],
	);

	const getFirstLabel = useCallback(() => {
		if (labels.length === 0) {
			return handleAddLabel();
		}
		return labels.at(0);
	}, [labels]);

	const isUsedLabel = useCallback(
		(id: string) => {
			return !!usedLabelIds.find((label) => label === id);
		},
		[usedLabelIds],
	);

	const handleStartDrag = useCallback(
		(x: number, y: number, existingSquare?: Square, corner?: string) => {
			if (existingSquare) {
				startDrag(
					x,
					y,
					existingSquare,
					corner as "top-left" | "top-right" | "bottom-left" | "bottom-right",
				);
				return;
			}

			const unusedLabel = getFirstLabel();
			if (!unusedLabel) return;

			const newSquareId = nanoid();
			startDrag(
				x,
				y,
				undefined,
				corner as "top-left" | "top-right" | "bottom-left" | "bottom-right",
				newSquareId,
			);
			updateSquare?.(newSquareId, { labelId: unusedLabel.id });
		},
		[startDrag, getFirstLabel, updateSquare],
	);

	const handleShapeDragStart = useCallback(
		(type: "polygon" | "path", id: string, event: React.MouseEvent) => {
			event.stopPropagation();
			const { x, y } = getMousePosition(event);
			const targetElement = document.elementFromPoint(
				event.clientX,
				event.clientY,
			);
			if (targetElement?.classList.contains("resize-handle")) {
				const cornerId = targetElement.getAttribute("data-corner-id");
				const [type, id, indexStr] = cornerId?.split("::") || [];
				const index = Number.parseInt(indexStr ?? "", 10);
				if (type === "polygon" && id && !Number.isNaN(index)) {
					const polygon = polygons.find((p) => p.id === id);
					if (polygon && !polygon.isLocked) {
						startPolygonDrag(id, { x, y }, "point", index);
						return;
					}
				}
			}
			if (type === "polygon") {
				startPolygonDrag(id, { x, y });
			} else {
				startPathDrag(id, { x, y });
			}
		},
		[getMousePosition, startPolygonDrag, startPathDrag, polygons],
	);

	const handleShapeClick = useCallback(
		(type: "polygon" | "path", id: string, event: React.MouseEvent) => {
			event.stopPropagation();
			if (event.button === 2 && event.type === "contextmenu") {
				setSelectedShape({ type, id });
				setShapeContextMenu({
					x: event.clientX / zoom,
					y: event.clientY / zoom,
				});
			} else {
				setSelectedShape((prev) => (prev?.id === id ? null : { type, id }));
			}
		},
		[zoom],
	);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			if (event.button !== 0) return;
			const unusedLabel = getFirstLabel();
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
					const shapeElement = (event.target as Element).closest(
						"[data-shape-id]",
					);
					if (shapeElement) {
						if (activePolygon) {
							addPoint({ x, y });
							setSelectedShape(null);
							return;
						}
						if (!shapeElement?.hasAttribute("data-shape-id")) return;
						const shapeId = shapeElement.getAttribute("data-shape-id");
						if (!shapeId) return;
						const [type, id] = shapeId.split("::");
						const polygon = polygons.find((p) => p.id === id);
						if (polygon) {
							setSelectedShape({ type: type as "polygon" | "path", id });
							setSelectedPolygon(id);
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
				case "freehand":
					if ((event.target as Element).closest("[data-shape-id]")) {
						const shapeElement = (event.target as Element).closest(
							"[data-shape-id]",
						);
						if (!shapeElement?.hasAttribute("data-shape-id")) return;
						const shapeId = shapeElement.getAttribute("data-shape-id");
						if (!shapeId) return;
						const [type, id] = shapeId.split("::");
						const path = freehandPaths.find((p) => p.id === id);
						if (path) {
							setSelectedShape({ type: type as "polygon" | "path", id });
							setSelectedPath(id);
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
						const [type, id] = pathData.split("::");
						if (type === "polygon") {
							deletePolygon(id);
						} else if (type === "path") {
							deletePath(id);
						}
					}
					break;
				}
				default:
					console.log("not implemented");
			}
		},
		[
			mode,
			deletePolygon,
			deleteSquare,
			freehandPaths,
			startPolygonDrag,
			setSelectedPath,
			setSelectedPolygon,
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
			getFirstLabel,
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
					const [type, id] = shapeId.split("::");
					setSelectedShape({ type: type as "polygon" | "path", id: id });
					setShapeContextMenu({
						x: event.clientX / zoom,
						y: event.clientY / zoom,
					});
				}
				return;
			}
		},
		[setSelectedSquare, zoom],
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
			id: nanoid(),
			name,
			color,
		};
		onChange?.({ labels: [...labels, newLabel] });
		setLabels((prev) => {
			const updated = [...prev, newLabel];
			return updated;
		});
		return newLabel;
	}, [onChange, labels]);

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
			if (labels.length > 0) {
				const shape = findShapeById(labelId);
				switch (mode) {
					case "select": {
						setSelectedShape(null);
						setContextMenu(null);
						setShapeContextMenu(null);
						onChange?.({
							classifiedLabel: labelId,
						});
						break;
					}
					case "square": {
						if (shape?.id) {
							setSelectedSquare(shape?.id);
							setSelectedShape(null);
							setContextMenu(null);
							setShapeContextMenu(null);
						}
						updateLabel(selectedSquare, labelId, updateSquare);
						break;
					}
					case "polygon": {
						if (shape?.id) {
							setSelectedShape({
								type: "polygon",
								id: shape?.id,
							});
							setSelectedPolygon(shape?.id);
							setSelectedSquare(null);
							setContextMenu(null);
							setShapeContextMenu(null);
						}
						console.log(selectedPolygon);
						updateLabel(selectedPolygon, labelId, updatePolygon);
						break;
					}
					case "freehand": {
						if (shape?.id) {
							setSelectedShape({
								type: "path",
								id: shape?.id,
							});
							setSelectedPath(shape.id);
							setSelectedSquare(null);
							setContextMenu(null);
							setShapeContextMenu(null);
						}
						updateLabel(selectedPath, labelId, updatePath);

						break;
					}
				}
			}
		},
		[
			selectedSquare,
			findShapeById,
			onChange,
			setSelectedPath,
			setSelectedPolygon,
			mode,
			labels.length,
			setSelectedSquare,
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

	const handleZoomToFit = () => {
		const container = containerRef.current;
		if (!container) return;

		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;

		const zoomX = windowWidth / (containerWidth * 1.25);
		const zoomY = windowHeight / (containerHeight * 1.25);
		const newZoom = Math.min(zoomX, zoomY);

		setZoom(Math.max(0.25, Math.min(4, Number.parseFloat(newZoom.toFixed(2)))));
	};

	const scrollToCenter = useCallback(() => {
		window.scrollTo({
			left: (document.documentElement.scrollWidth - window.innerWidth) / 2,
			top: (document.documentElement.scrollHeight - window.innerHeight) / 2,
		});
	}, []);

	useEffect(() => {
		if (!zoom) return;
		if (!containerRef.current) return;
		const observer = new ResizeObserver(() => {
			if (containerRef.current) {
				scrollToCenter();
			}
		});

		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, [scrollToCenter, zoom]);

	const visibleSquares = squares.filter((square) => {
		if (!selectedLabel) return true;
		return square.labelId === selectedLabel;
	});

	const classifiedLabel = labels?.find((l) => l.id === editor.classifiedLabel);

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
				ref={overlayRef}
				style={{
					width: Math.max(size?.width * zoom + 184, windowWidth),
					height: Math.max(size?.height * zoom + 144, windowHeight),
					paddingTop: size?.height * zoom + 144,
					paddingLeft: size?.width * zoom + 144,
					paddingRight: size?.width * zoom + 144,
					paddingBottom: size?.height * zoom + 144,
				}}
				className={cn(
					"space-y-4 flex items-center absolute top-0 left-0",
					"origin-center",
					"[background-size:20px_20px]",
					"[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
					"dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
				)}
			>
				<div className="w-full relative origin-center flex shrink-0 items-center justify-center">
					<div
						ref={containerRef}
						style={{
							width: size?.width,
							height: size?.height,
							minWidth: size?.width,
							minHeight: size?.height,
							backgroundSize: `${size?.width}px ${size?.height}px`,
							backgroundImage: `url(${image})`,
							transform: `scale(${zoom})`,
						}}
						className="relative origin-center bg-no-repeat bg-contain bg-center border rounded-sm shadow-md bg-white border-gray-300"
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
										left: square.x,
										top: square.y,
										width: square.width,
										height: square.height,
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
										<ResizeHandler />
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
							zoom={zoom}
							labels={labels}
							square={squares.find((s) => s.id === selectedSquare)}
							onDelete={() => {
								deleteSquare(selectedSquare);
								onChange?.({ squares });
								setContextMenu(null);
							}}
							onClose={() => setContextMenu(null)}
							onUpdate={(updates) => {
								updateSquare(selectedSquare, updates);
								onChange?.({ squares });
							}}
							onMoveForward={() => moveSquareForward(selectedSquare)}
							onMoveBackward={() => moveSquareBackward(selectedSquare)}
						/>
					)}
					{shapeContextMenu && selectedShape && (
						<ShapeContextMenu
							x={shapeContextMenu.x}
							y={shapeContextMenu.y}
							zoom={zoom}
							shape={
								selectedShape.type === "polygon"
									? polygons.find((p) => p.id === selectedShape.id)
									: freehandPaths.find((p) => p.id === selectedShape.id)
							}
							labels={labels}
							onDelete={() => {
								if (selectedShape.type === "polygon") {
									deletePolygon(selectedShape.id);
									onChange?.({ polygons });
								} else {
									deletePath(selectedShape.id);
									onChange?.({ freehandPaths });
								}
								setSelectedShape(null);
								setShapeContextMenu(null);
							}}
							onClose={() => setShapeContextMenu(null)}
							onUpdate={(updates) => {
								if (selectedShape.type === "polygon") {
									updatePolygon(selectedShape.id, updates);
									onChange?.({ polygons });
								} else {
									updatePath(selectedShape.id, updates);
									onChange?.({ freehandPaths });
								}
							}}
							onMoveForward={() => {
								if (selectedShape.type === "polygon") {
									movePolygonForward(selectedShape.id);
									onChange?.({ polygons });
								} else {
									movePathForward(selectedShape.id);
									onChange?.({ freehandPaths });
								}
							}}
							onMoveBackward={() => {
								if (selectedShape.type === "polygon") {
									movePolygonBackward(selectedShape.id);
									onChange?.({ polygons });
								} else {
									movePathBackward(selectedShape.id);
									onChange?.({ polygons });
								}
							}}
						/>
					)}
				</div>
			</div>
			<CanvasSidebar
				labels={labels}
				onAddLabel={handleAddLabel}
				onRemoveLabel={handleRemoveLabel}
				onLabelClick={handleLabelClick}
				onUpdateLabel={handleUpdateLabel}
				selectedLabel={selectedLabel ?? undefined}
				usedLabels={usedLabelIds}
				width={width}
				height={height}
				onZoomToFit={handleZoomToFit}
				zoom={zoom}
				onZoomUpdate={scrollToCenter}
				onZoomChange={setZoom}
			/>
		</div>
	);
}
