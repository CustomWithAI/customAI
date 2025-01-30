"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DotBadge } from "@/components/ui/dot-badge";
import { useSquares } from "@/hooks/useSquare";
import { cn } from "@/libs/utils";
import type { Label, Square } from "@/types/square";
import { darkenColor } from "@/utils/color-utils";
import { generateRandomLabel } from "@/utils/random";
import { Download } from "lucide-react";
import { Lock } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContextMenu } from "./context-menu";
import { LabelSidebar } from "./label-sidebar";

interface SquareEditorProps {
	width?: number;
	height?: number;
	onChange?: (square: Square) => void;
}

export default function SquareEditor({
	width = 800,
	height = 600,
	onChange,
}: SquareEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [labels, setLabels] = useState<Label[]>([]);
	const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

	const {
		squares,
		selectedSquare,
		setSelectedSquare,
		startDrag,
		updateDrag,
		endDrag,
		deleteSquare,
		updateSquare,
		moveSquareForward,
		moveSquareBackward,
	} = useSquares(onChange);

	const getMousePosition = useCallback((event: React.MouseEvent) => {
		const container = containerRef.current;
		if (!container) return { x: 0, y: 0 };

		const rect = container.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}, []);

	// Move this function before handleStartDrag
	const getUnusedLabel = useCallback(() => {
		const usedLabelIds = squares
			.map((square) => square.labelId)
			.filter(Boolean) as string[];
		return labels.find((label) => !usedLabelIds.includes(label.id));
	}, [squares, labels]);

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
				startDrag(x, y, existingSquare, corner as any);
			}
		},
		[startDrag, getUnusedLabel, updateSquare],
	);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			if (event.button !== 0) return;

			const unusedLabel = getUnusedLabel() || handleAddLabel();
			if (
				!unusedLabel &&
				!(event.target as Element).closest("[data-square-id]")
			) {
				return;
			}

			const { x, y } = getMousePosition(event);

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
		},
		[
			squares,
			handleStartDrag,
			setSelectedSquare,
			getMousePosition,
			getUnusedLabel,
		],
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
				console.log("deleting..");
				deleteSquare(selectedSquare);
				setContextMenu(null);
			}
		},
		[deleteSquare, selectedSquare],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent) => {
			const { x, y } = getMousePosition(event);
			updateDrag(x, y);
		},
		[updateDrag, getMousePosition],
	);

	const handleMouseUp = useCallback(() => {
		endDrag();
	}, [endDrag]);

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
	}, [squares, labels]);

	const handleAddLabel = useCallback(() => {
		const { name, color } = generateRandomLabel();
		const newLabel: Label = {
			id: Date.now().toString(),
			name,
			color,
		};
		setLabels((prev) => [...prev, newLabel]);
		return newLabel;
	}, []);

	const handleRemoveLabel = useCallback(
		(labelId: string) => {
			setLabels((prev) => prev.filter((label) => label.id !== labelId));
			setSelectedLabel((prev) => (prev === labelId ? null : prev));
			for (const square of squares) {
				if (square.labelId === labelId) {
					updateSquare(square.id, { labelId: undefined });
				}
			}
		},
		[squares, updateSquare],
	);

	const handleLabelClick = useCallback(
		(labelId: string) => {
			if (selectedSquare) {
				updateSquare(selectedSquare, { labelId: labelId });
			}
		},
		[selectedSquare, updateSquare],
	);

	const handleUpdateLabel = useCallback((updatedLabel: Label) => {
		setLabels((prev) =>
			prev.map((label) =>
				label.id === updatedLabel.id ? updatedLabel : label,
			),
		);
	}, []);

	const usedLabelIds = squares
		.map((square) => square.labelId)
		.filter(Boolean) as string[];

	const visibleSquares = squares.filter((square) => {
		if (!selectedLabel) return true;
		return square.labelId === selectedLabel;
	});

	return (
		<div className="flex w-full h-full">
			<div className="flex-1 space-y-4">
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
										zIndex: square.zIndex || 0,
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
					</div>
					{contextMenu && selectedSquare && (
						<ContextMenu
							x={contextMenu.x}
							y={contextMenu.y}
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
