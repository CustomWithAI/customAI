"use client";

import { useSquares } from "@/hooks/useSquare";
import type { Square, SquareStyle } from "@/types/square";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContextMenu } from "./context-menu";

const CORNER_SIZE = 10;
const ROTATION_HANDLE_DISTANCE = 20;

interface CanvasProps {
	width?: number;
	height?: number;
	onChange?: (change: Square) => void;
}

export default function Canvas({
	width = 800,
	height = 600,
	onChange,
}: CanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const {
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
	} = useSquares(onChange);

	const getMousePosition = useCallback((event: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return { x: 0, y: 0 };

		const rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}, []);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			if (event.button !== 0) return;

			const { x, y } = getMousePosition(event);
			let handled = false;

			if (selectedSquare) {
				const selectedSquareObj = squares.find((s) => s.id === selectedSquare);
				if (selectedSquareObj) {
					const centerX = selectedSquareObj.x + selectedSquareObj.width / 2;
					const centerY = selectedSquareObj.y - ROTATION_HANDLE_DISTANCE;
					if (
						Math.abs(x - centerX) <= CORNER_SIZE / 2 &&
						Math.abs(y - centerY) <= CORNER_SIZE / 2
					) {
						startDrag(x, y, selectedSquareObj, undefined, true);
						handled = true;
					}
				}
			}

			if (!handled) {
				for (const square of [...squares].reverse()) {
					const corners = [
						{ x: square.x, y: square.y, type: "top-left" as const },
						{
							x: square.x + square.width,
							y: square.y,
							type: "top-right" as const,
						},
						{
							x: square.x,
							y: square.y + square.height,
							type: "bottom-left" as const,
						},
						{
							x: square.x + square.width,
							y: square.y + square.height,
							type: "bottom-right" as const,
						},
					];

					for (const corner of corners) {
						if (
							Math.abs(x - corner.x) <= CORNER_SIZE / 2 &&
							Math.abs(y - corner.y) <= CORNER_SIZE / 2
						) {
							startDrag(x, y, square, corner.type);
							handled = true;
							break;
						}
					}

					if (!isPointInSquare({ x, y }, square)) {
						continue;
					}
					if (handled) break;
				}
			}

			if (!handled) {
				for (const square of [...squares].reverse()) {
					if (isPointInSquare({ x, y }, square, 4)) {
						setSelectedSquare(square.id);
						startDrag(x, y, square);
						handled = true;
						break;
					}
				}
			}

			if (!handled) {
				setSelectedSquare(null);
				startDrag(x, y);
			}
		},
		[
			squares,
			selectedSquare,
			startDrag,
			setSelectedSquare,
			isPointInSquare,
			getMousePosition,
		],
	);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!ctx || !canvas) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (const square of squares) {
			ctx.save();
			const centerX = square.x + square.width / 2;
			const centerY = square.y + square.height / 2;
			ctx.translate(centerX, centerY);
			ctx.rotate(((square.rotation || 0) * Math.PI) / 180);
			ctx.translate(-centerX, -centerY);
			const style = square.style || {};
			if (style.backgroundColor) {
				ctx.fillStyle = style.backgroundColor;
				if (style.opacity !== undefined) {
					ctx.globalAlpha = style.opacity;
				}

				if (style.borderRadius) {
					const radius = style.borderRadius;
					ctx.beginPath();
					ctx.moveTo(square.x + radius, square.y);
					ctx.lineTo(square.x + square.width - radius, square.y);
					ctx.quadraticCurveTo(
						square.x + square.width,
						square.y,
						square.x + square.width,
						square.y + radius,
					);
					ctx.lineTo(
						square.x + square.width,
						square.y + square.height - radius,
					);
					ctx.quadraticCurveTo(
						square.x + square.width,
						square.y + square.height,
						square.x + square.width - radius,
						square.y + square.height,
					);
					ctx.lineTo(square.x + radius, square.y + square.height);
					ctx.quadraticCurveTo(
						square.x,
						square.y + square.height,
						square.x,
						square.y + square.height - radius,
					);
					ctx.lineTo(square.x, square.y + radius);
					ctx.quadraticCurveTo(square.x, square.y, square.x + radius, square.y);
					ctx.closePath();
					ctx.fill();
				} else {
					ctx.fillRect(square.x, square.y, square.width, square.height);
				}
			}
			ctx.strokeStyle =
				square.id === selectedSquare
					? "#0066cc"
					: style.borderColor || "#000000";
			ctx.lineWidth = style.borderWidth || 2;
			if (style.borderRadius) {
				ctx.stroke();
			} else {
				ctx.strokeRect(square.x, square.y, square.width, square.height);
			}
			if (style.shadow) {
				ctx.shadowBlur = style.shadow.blur || 0;
				ctx.shadowColor = style.shadow.color || "rgba(0, 0, 0, 0.2)";
				ctx.shadowOffsetX = style.shadow.offset?.x || 0;
				ctx.shadowOffsetY = style.shadow.offset?.y || 0;
			}

			if (square.id === selectedSquare) {
				ctx.fillStyle = "#ffffff";
				ctx.strokeStyle = "#0066cc";
				const corners = [
					{ x: square.x, y: square.y },
					{ x: square.x + square.width, y: square.y },
					{ x: square.x, y: square.y + square.height },
					{ x: square.x + square.width, y: square.y + square.height },
				];
				for (const corner of corners) {
					ctx.beginPath();
					ctx.arc(corner.x, corner.y, CORNER_SIZE / 2, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();
				}
				const centerX = square.x + square.width / 2;
				const centerY = square.y - ROTATION_HANDLE_DISTANCE;
				ctx.beginPath();
				ctx.arc(centerX, centerY, CORNER_SIZE / 2, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(centerX, square.y);
				ctx.lineTo(centerX, centerY);
				ctx.stroke();
			}

			ctx.restore();
		}
	}, [squares, selectedSquare]);

	useEffect(() => {
		draw();
	}, [draw]);

	const handleMouseMove = (event: React.MouseEvent) => {
		const { x, y } = getMousePosition(event);
		updateDrag(x, y);
	};

	const handleMouseUp = () => {
		endDrag();
	};

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		setContextMenu(getMousePosition(event));
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Backspace") {
				if (selectedSquare) {
					deleteSquare(selectedSquare);
					setContextMenu(null);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedSquare, deleteSquare]);

	return (
		<div className="relative">
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				className="border border-gray-300"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				onContextMenu={handleContextMenu}
			/>
			{contextMenu && selectedSquare && (
				<ContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					onDelete={() => {
						deleteSquare(selectedSquare);
						setContextMenu(null);
					}}
					onUpdateStyle={(style) => {
						updateSquareStyle(selectedSquare, style);
						setContextMenu(null);
					}}
					onClose={() => setContextMenu(null)}
				/>
			)}
		</div>
	);
}
