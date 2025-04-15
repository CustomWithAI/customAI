"use client";

import type { Position, Square } from "@/types/square";
import { useCallback, useState } from "react";

interface DragState {
	type: "create" | "move" | "resize";
	squareId?: string;
	startPos: Position;
	corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	originalSquare?: Square;
}

export function useSquares(onChange?: (change: Square | Square[]) => void) {
	const [squares, setSquares] = useState<Square[]>([]);
	const [dragState, setDragState] = useState<DragState | null>(null);
	const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

	const startDrag = useCallback(
		(
			x: number,
			y: number,
			existingSquare?: Square,
			corner?: DragState["corner"],
			id = "",
		) => {
			if (existingSquare) {
				setDragState({
					type: corner ? "resize" : "move",
					squareId: existingSquare.id,
					startPos: { x, y },
					corner,
					originalSquare: { ...existingSquare },
				});
			} else {
				const newSquare: Square = {
					id,
					x,
					y,
					width: 0,
					height: 0,
					zIndex: squares.length,
					labelId: undefined,
				};
				setDragState({
					type: "create",
					startPos: { x, y },
					originalSquare: newSquare,
				});
				setSquares((prev) => [...prev, newSquare]);
			}
		},
		[squares.length],
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
						const x = width >= 0 ? dragState.startPos.x : currentX;
						const y = height >= 0 ? dragState.startPos.y : currentY;
						const absWidth = Math.abs(width);
						const absHeight = Math.abs(height);

						const updatedSquare = {
							...newSquares[squareIndex],
							x,
							y,
							width: absWidth,
							height: absHeight,
						};
						newSquares[squareIndex] = updatedSquare;
						onChange?.(updatedSquare);
					}

					return newSquares;
				}

				const squareIndex = newSquares.findIndex(
					(s) => s.id === dragState.squareId,
				);
				if (squareIndex === -1 || !dragState.originalSquare) return prev;

				const square = { ...newSquares[squareIndex] };
				const dx = currentX - dragState.startPos.x;
				const dy = currentY - dragState.startPos.y;

				if (dragState.type === "move") {
					square.x = dragState.originalSquare.x + dx;
					square.y = dragState.originalSquare.y + dy;
				} else if (dragState.type === "resize") {
					switch (dragState.corner) {
						case "top-left":
							square.width = Math.max(0, dragState.originalSquare.width - dx);
							square.height = Math.max(0, dragState.originalSquare.height - dy);
							square.x =
								dragState.originalSquare.x +
								(dragState.originalSquare.width - square.width);
							square.y =
								dragState.originalSquare.y +
								(dragState.originalSquare.height - square.height);
							break;
						case "top-right":
							square.width = Math.max(0, dragState.originalSquare.width + dx);
							square.height = Math.max(0, dragState.originalSquare.height - dy);
							square.y =
								dragState.originalSquare.y +
								(dragState.originalSquare.height - square.height);
							break;
						case "bottom-left":
							square.width = Math.max(0, dragState.originalSquare.width - dx);
							square.height = Math.max(0, dragState.originalSquare.height + dy);
							square.x =
								dragState.originalSquare.x +
								(dragState.originalSquare.width - square.width);
							break;
						case "bottom-right":
							square.width = Math.max(0, dragState.originalSquare.width + dx);
							square.height = Math.max(0, dragState.originalSquare.height + dy);
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

	const endDrag = useCallback(() => {
		if (dragState?.type === "create") {
			setSquares((prev) => {
				const lastSquare = prev[prev.length - 1];
				if (
					lastSquare &&
					(Math.abs(lastSquare.width) < 5 || Math.abs(lastSquare.height) < 5)
				) {
					return prev.slice(0, -1);
				}
				return prev;
			});
		}
		setDragState(null);
	}, [dragState]);

	const deleteSquare = useCallback(
		(id: string) => {
			setSquares((prev) => {
				const state = prev.filter((square) => square.id !== id);
				onChange?.(state);
				return state;
			});
			setSelectedSquare(null);
		},
		[onChange],
	);

	const updateSquare = useCallback(
		(id: string, updates: Partial<Square>) => {
			setSquares((prev) => {
				const updated = prev.map((square) =>
					square.id === id ? { ...square, ...updates } : square,
				);
				onChange?.(updated);
				return updated;
			});
		},
		[onChange],
	);

	const moveSquareForward = useCallback((id: string) => {
		setSquares((prev) => {
			const index = prev.findIndex((s) => s.id === id);
			if (index === -1 || index === prev.length - 1) return prev;

			const newSquares = [...prev];
			const square = newSquares[index];
			const nextSquare = newSquares[index + 1];

			// Swap z-indices
			const tempZIndex = square.zIndex;
			square.zIndex = nextSquare.zIndex;
			nextSquare.zIndex = tempZIndex;

			// Swap positions in array
			newSquares[index] = nextSquare;
			newSquares[index + 1] = square;

			return newSquares;
		});
	}, []);

	const moveSquareBackward = useCallback((id: string) => {
		setSquares((prev) => {
			const index = prev.findIndex((s) => s.id === id);
			if (index <= 0) return prev;

			const newSquares = [...prev];
			const square = newSquares[index];
			const prevSquare = newSquares[index - 1];

			const tempZIndex = square.zIndex;
			square.zIndex = prevSquare.zIndex;
			prevSquare.zIndex = tempZIndex;

			newSquares[index] = prevSquare;
			newSquares[index - 1] = square;

			return newSquares;
		});
	}, []);

	return {
		squares,
		setSquares,
		selectedSquare,
		setSelectedSquare,
		startDrag,
		updateDrag,
		endDrag,
		deleteSquare,
		updateSquare,
		moveSquareForward,
		moveSquareBackward,
	};
}
