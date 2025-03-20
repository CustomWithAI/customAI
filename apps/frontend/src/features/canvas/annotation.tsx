"use client";

import { Content, Header } from "@/components/typography/text";
import type { Editor, Mode } from "@/types/square";
import { useCallback, useEffect, useMemo, useState } from "react";
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
export default function AnnotationSection({
	type,
	image,
	onNext,
	onUpdate,
	disabled,
	name,
	isLoading,
	defaultValue,
	onPrevious,
	length,
}: {
	type: string;
	image: string;
	length: number;
	current?: number;
	name?: string;
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
		mode: "square" as Mode,
		classifiedLabel: "",
		polygons: [],
		freehandPaths: [],
		...defaultValue,
	});

	useEffect(() => {
		if (!isLoading && defaultValue) {
			setEditor((prev) => {
				return { ...prev, ...defaultValue };
			});
		}
	}, [isLoading, defaultValue]);

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
				<div className="mb-4">
					<Header className=" text-blue-600">Annotation</Header>
					<Content className="text-gray-400">{name}</Content>
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
				initialLabels={editor.labels}
				editor={editor}
				type={type}
				image={image}
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
