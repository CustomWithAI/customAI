"use client";

import type { Square } from "@/types/square";
import { useCallback, useState } from "react";
import Canvas from "./canvas";

export default function AnnotationSection() {
	const [selectedSquareInfo, setSelectedSquareInfo] = useState<Square | null>(
		null,
	);

	const handleChange = useCallback((square: Square) => {
		setSelectedSquareInfo(square);
		console.log("Square changed:", {
			id: square.id,
			x: Math.round(square.x),
			y: Math.round(square.y),
			width: Math.round(square.width),
			height: Math.round(square.height),
			rotation: Math.round(square.rotation || 0),
			style: square.style,
		});
	}, []);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Interactive Canvas</h1>
			<div className="mb-4">
				<p className="text-sm text-gray-600">
					Click and drag to create squares. Right-click to access style options.
					Drag squares to move them. Drag corners to resize. Drag rotation
					handle to rotate.
				</p>
			</div>
			<div className="flex gap-4">
				<Canvas onChange={handleChange} />
				{selectedSquareInfo && (
					<div className="w-64 p-4 bg-gray-50 rounded">
						<h2 className="font-bold mb-2">Selected Square</h2>
						<div className="space-y-2 text-sm">
							<p>
								Position: ({Math.round(selectedSquareInfo.x)},{" "}
								{Math.round(selectedSquareInfo.y)})
							</p>
							<p>
								Size: {Math.round(selectedSquareInfo.width)} ×{" "}
								{Math.round(selectedSquareInfo.height)}
							</p>
							<p>Rotation: {Math.round(selectedSquareInfo.rotation || 0)}°</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
