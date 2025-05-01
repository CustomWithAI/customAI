"use client";

import { Content, Header } from "@/components/typography/text";
import type { Editor, Mode } from "@/types/square";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorNavigation } from "./editor-navigation";
import SquareEditor from "./square-editor";

const DEFAULT_EDITOR = {
	id: "1",
	squares: [],
	labels: [],
	mode: "square" as Mode,
	classifiedLabel: "",
	polygons: [],
	freehandPaths: [],
};

const MODE_EDITOR: Record<string, Mode> = {
	classification: "select",
	object_detection: "square",
	segmentation: "polygon",
};
export default function AnnotationSection({
	type,
	image,
	onNext,
	onUpdate,
	disabled,
	name,
	isLoading,
	defaultValue,
	mode,
	onPrevious,
	length,
}: {
	type: string;
	image: string;
	length: number;
	current?: number;
	name?: string;
	mode?: string;
	disabled?: [boolean, boolean];
	defaultValue?: Partial<Editor>;
	isLoading?: boolean;
	onNext?: () => void;
	onUpdate?: (data: Editor, isClose: boolean) => void;
	onPrevious?: () => void;
}) {
	const [editor, setEditor] = useState<Editor>({
		id: "1",
		squares: [],
		labels: [],
		mode: mode ? MODE_EDITOR[mode] : "square",
		classifiedLabel: "",
		polygons: [],
		freehandPaths: [],
		...defaultValue,
	});

	useEffect(() => {
		if (!isLoading && defaultValue) {
			setEditor({
				id: "1",
				squares: [],
				labels: [],
				mode: mode ? MODE_EDITOR[mode] : "square",
				classifiedLabel: "",
				polygons: [],
				freehandPaths: [],
				...defaultValue,
			});
		}
	}, [isLoading, defaultValue, mode]);

	const handlePrevious = useCallback(() => {
		onUpdate?.(editor, false);
		onPrevious?.();
	}, [onPrevious, editor, onUpdate]);

	const handleNext = useCallback(() => {
		onUpdate?.(editor, false);
		onNext?.();
	}, [onNext, editor, onUpdate]);

	const handleSubmit = useCallback(() => {
		onUpdate?.(editor, true);
	}, [onUpdate, editor]);

	const handleEditorChange = (
		editorId: string,
		updatedEditor: Partial<Editor>,
	) => {
		setEditor((prev) => ({ ...prev, ...updatedEditor }));
	};

	return (
		<div>
			<div className="fixed top-0 left-0 z-99 w-full bg-white px-6 pt-4 flex justify-between items-center">
				<div className="mb-4 mr-4">
					<Header className=" text-blue-600">Annotation</Header>
					<Content className="text-gray-400 line-clamp-2 break-all">
						{name}
					</Content>
				</div>
				<EditorNavigation
					onSubmit={handleSubmit}
					disabled={disabled}
					totalEditors={length}
					onPrevious={handlePrevious}
					onNext={handleNext}
				/>
			</div>
			<SquareEditor
				editorId={editor.id}
				initialSquares={editor.squares}
				initialPolygons={editor.polygons}
				initialLabels={editor.labels}
				editor={editor}
				type={type}
				image={image}
				onLoad={isLoading}
				mode={editor.mode}
				onModeChange={(mode) => {
					handleEditorChange(editor.id, { mode });
				}}
				onChange={(update) => {
					handleEditorChange(editor.id, update);
				}}
			/>
		</div>
	);
}
