"use client";

import type { Square } from "@/types/square";
import SquareEditor from "./square-editor";

export default function Page() {
	const handleChange = (square: Square) => {
		console.log("Square changed:", {
			id: square.id,
			x: Math.round(square.x),
			y: Math.round(square.y),
			width: Math.round(square.width),
			height: Math.round(square.height),
		});
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Interactive Square Editor</h1>
			<div className="mb-4">
				<p className="text-sm text-gray-600">
					Click and drag to create squares. Right-click to delete. Drag squares
					to move them. Drag corners to resize.
				</p>
			</div>
			<SquareEditor onChange={handleChange} />
		</div>
	);
}
