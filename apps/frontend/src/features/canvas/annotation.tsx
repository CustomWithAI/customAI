"use client";

import type { Editor, Mode } from "@/types/square";
import { useState } from "react";
import { EditorNavigation } from "./editor-navigation";
import SquareEditor from "./square-editor";

export default function Page() {
	const [editors, setEditors] = useState<Editor[]>([
		{
			id: "1",
			squares: [],
			labels: [],
			mode: "square" as Mode,
			polygons: [],
			freehandPaths: [],
		},
		{
			id: "2",
			squares: [],
			labels: [],
			mode: "square" as Mode,
			polygons: [],
			freehandPaths: [],
		},
	]);
	const [currentEditorIndex, setCurrentEditorIndex] = useState(0);

	const handlePrevious = () => {
		setCurrentEditorIndex((prev) => Math.max(0, prev - 1));
	};

	const handleNext = () => {
		setCurrentEditorIndex((prev) => Math.min(editors.length - 1, prev + 1));
	};

	const handleEditorChange = (
		editorId: string,
		updatedEditor: Partial<Editor>,
	) => {
		setEditors((prev) =>
			prev.map((editor) =>
				editor.id === editorId ? { ...editor, ...updatedEditor } : editor,
			),
		);
	};
	const currentEditor = editors[currentEditorIndex];

	return (
		<div className="p-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Interactive Square Editor</h1>
				<EditorNavigation
					currentIndex={currentEditorIndex}
					totalEditors={editors.length}
					onPrevious={handlePrevious}
					onNext={handleNext}
				/>
			</div>
			<div className="mb-4">
				<p className="text-xs text-gray-600">
					Click and drag to create squares. Right-click to delete. Drag squares
					to move them. Drag corners to resize.
				</p>
			</div>
			<SquareEditor
				key={currentEditor.id}
				editorId={currentEditor.id}
				initialSquares={currentEditor.squares}
				initialLabels={currentEditor.labels}
				mode={currentEditor.mode}
				onModeChange={(mode) => {
					handleEditorChange(currentEditor.id, { mode });
				}}
				onChange={(squares, labels) => {
					handleEditorChange(currentEditor.id, { squares, labels });
				}}
			/>
		</div>
	);
}
