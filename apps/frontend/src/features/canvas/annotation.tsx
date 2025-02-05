"use client";

import { Content, Header } from "@/components/typography/text";
import type { Editor, Mode } from "@/types/square";
import { useCallback, useMemo, useState } from "react";
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

	const handlePrevious = useCallback(() => {
		setCurrentEditorIndex((prev) => Math.max(0, prev - 1));
	}, []);

	const handleNext = useCallback(() => {
		setCurrentEditorIndex((prev) => Math.min(editors.length - 1, prev + 1));
	}, [editors.length]);

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
	const currentEditor = useMemo(
		() => editors[currentEditorIndex],
		[editors, currentEditorIndex],
	);

	return (
		<div className="p-6">
			<div className="flex justify-between items-center">
				<div className="mb-4">
					<Header className=" text-blue-600">Annotation</Header>
					<Content className="text-gray-400">xxx.jpg</Content>
				</div>
				<EditorNavigation
					currentIndex={currentEditorIndex}
					totalEditors={editors.length}
					onPrevious={handlePrevious}
					onNext={handleNext}
				/>
			</div>
			<SquareEditor
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
