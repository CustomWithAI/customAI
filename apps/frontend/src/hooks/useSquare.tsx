import type { Position, Square, SquareStyle } from "@/types/square";
import { useCallback, useState } from "react";

interface DragState {
	type: "create" | "move" | "resize" | "rotate";
	squareId?: string;
	startPos: Position;
	corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	currentSquare?: Square;
	startRotation?: number;
}

const DEFAULT_STYLE: SquareStyle = {
	backgroundColor: "#ffffff",
	borderColor: "#000000",
	borderWidth: 2,
	borderRadius: 0,
	opacity: 1,
};

export function useSquares(onChange?: (change: Square) => void) {
	const [squares, setSquares] = useState<Square[]>([]);
	const [dragState, setDragState] = useState<DragState | null>(null);
	const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
	const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

	const startDrag = useCallback(
		(
			x: number,
			y: number,
			existingSquare?: Square,
			corner?: DragState["corner"],
			isRotating?: boolean,
		) => {
			if (existingSquare) {
				setDragState({
					type: isRotating ? "rotate" : corner ? "resize" : "move",
					squareId: existingSquare.id,
					startPos: { x, y },
					corner,
					startRotation: existingSquare.rotation,
				});
				return;
			}
			const newSquare: Square = {
				id: Date.now().toString(),
				x,
				y,
				width: 0,
				height: 0,
				rotation: 0,
				style: { ...DEFAULT_STYLE },
			};
			setSquares((prev) => [...prev, newSquare]);
			setDragState({
				type: "create",
				startPos: { x, y },
				currentSquare: newSquare,
			});
		},
		[],
	);

	const updateDrag = useCallback(
		(currentX: number, currentY: number) => {
			if (!dragState) return;

			setSquares((prev) => {
				const newSquares = [...prev];

				if (dragState.type === "create") {
					const width = currentX - dragState.startPos.x;
					const height = currentY - dragState.startPos.y;
					const squareIndex = newSquares.length - 1;

					if (squareIndex >= 0) {
						const updatedSquare = {
							...newSquares[squareIndex],
							x: width < 0 ? currentX : dragState.startPos.x,
							y: height < 0 ? currentY : dragState.startPos.y,
							width: Math.abs(width),
							height: Math.abs(height),
						};
						newSquares[squareIndex] = updatedSquare;
						onChange?.(updatedSquare);
					}

					return newSquares;
				}

				const squareIndex = newSquares.findIndex(
					(s) => s.id === dragState.squareId,
				);
				if (squareIndex === -1) return prev;

				const square = { ...newSquares[squareIndex] };
				switch (dragState.type) {
					case "move": {
						const dx = currentX - dragState.startPos.x;
						const dy = currentY - dragState.startPos.y;
						square.x += dx;
						square.y += dy;
						dragState.startPos = { x: currentX, y: currentY };
						break;
					}
					case "resize": {
						switch (dragState.corner) {
							case "top-left":
								square.width += square.x - currentX;
								square.height += square.y - currentY;
								square.x = currentX;
								square.y = currentY;
								break;
							case "top-right":
								square.width = currentX - square.x;
								square.height += square.y - currentY;
								square.y = currentY;
								break;
							case "bottom-left":
								square.width += square.x - currentX;
								square.height = currentY - square.y;
								square.x = currentX;
								break;
							case "bottom-right":
								square.width = currentX - square.x;
								square.height = currentY - square.y;
								break;
						}
						break;
					}
					case "rotate": {
						const centerX = square.x + square.width / 2;
						const centerY = square.y + square.height / 2;
						const angle = Math.atan2(currentY - centerY, currentX - centerX);
						const degrees = (angle + 90) * (180 / Math.PI);
						square.rotation = degrees;
						break;
					}
				}
				onChange?.(square);
				newSquares[squareIndex] = square;
				return newSquares;
			});
		},
		[dragState, onChange],
	);

	const updateSquareStyle = useCallback(
		(id: string, style: Partial<SquareStyle>) => {
			setSquares((prev) => {
				const index = prev.findIndex((s) => s.id === id);
				if (index === -1) return prev;

				const newSquares = [...prev];
				newSquares[index] = {
					...newSquares[index],
					style: {
						...newSquares[index].style,
						...style,
					},
				};
				return newSquares;
			});
		},
		[],
	);

	const toggleSelect = useCallback(
		(id: string, event: React.MouseEvent) => {
			setSelectedSquare((prev) => {
				if (prev === id) {
					const index = squares.findIndex((s) => s.id === id);
					const squaresAtPoint = squares
						.filter((_, i) => i < index)
						.filter((s) =>
							isPointInSquare(
								{ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY },
								s,
							),
						);
					return squaresAtPoint.length > 0
						? squaresAtPoint[squaresAtPoint.length - 1].id
						: null;
				}
				return id;
			});
		},
		[squares],
	);

	const isPointInSquare = useCallback(
		(point: Position, square: Square, offset?: number) => {
			const adjustedPoint = {
				x: point.x + (offset || 0),
				y: point.y + (offset || 0),
			};
			const dx =
				adjustedPoint.x - (square.x + square.width / 2 + (offset || 0));
			const dy =
				adjustedPoint.y - (square.y + square.height / 2 + (offset || 0));
			const angle = -square.rotation * (Math.PI / 180);
			const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
			const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
			return (
				Math.abs(rotatedX) <= square.width / 2 &&
				Math.abs(rotatedY) <= square.height / 2
			);
		},
		[],
	);

	const endDrag = useCallback(() => {
		setDragState(null);
	}, []);

	const deleteSquare = useCallback((id: string) => {
		setSquares((prev) => prev.filter((s) => s.id !== id));
	}, []);

	return {
		squares,
		selectedSquare,
		hoveredSquare,
		setSelectedSquare,
		setHoveredSquare,
		startDrag,
		updateDrag,
		endDrag,
		deleteSquare,
		updateSquareStyle,
		toggleSelect,
		isPointInSquare,
	};
}
