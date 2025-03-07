"use client";
import { Content, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@/components/ui/dialog";
import EnhanceImage from "@/components/ui/enhanceImage";
import { useDragStore } from "@/contexts/dragContext";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import {
	type KeyboardEvent,
	useCallback,
	useDeferredValue,
	useMemo,
	useState,
} from "react";
import { FixedSizeList as List } from "react-window";
import type { z } from "zod";

export const AddFeatureSection = ({
	image,
	node,
}: {
	image?: string;
	node: (
		fields: DragColumn<z.ZodRawShape>[],
		onUpdateMetadata: (payload: {
			id: string;
			metadata: Metadata;
		}) => void,
	) => DragColumn[];
}) => {
	const onAdd = useDragStore((state) => state.onAdd);
	const fields = useDragStore((state) => state.fields);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const [selected, setSelected] = useState<DragColumn[]>([]);
	const deferredSelected = useDeferredValue(selected);

	const input = useMemo(() => {
		return node(fields, onUpdateMetadata);
	}, [fields, onUpdateMetadata, node]);
	if (!image) {
		return;
	}

	const toggleSelection = useCallback((element: DragColumn) => {
		setSelected((prev) =>
			prev.some((item) => item.id === element.id)
				? prev.filter((item) => item.id !== element.id)
				: [...prev, element],
		);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>, element: DragColumn) => {
			if (event.key === "Enter" || event.key === " ") {
				toggleSelection(element);
			}
		},
		[toggleSelection],
	);

	const Row = ({
		index,
		style,
	}: { index: number; style: React.CSSProperties }) => {
		const element = input[index];
		const isChecked = deferredSelected.some((item) => item.id === element.id);

		return (
			<div
				key={element.id}
				style={style}
				onKeyDown={(e) => handleKeyDown(e, element)}
				onClick={() => toggleSelection(element)}
				className="flex gap-x-8 hover:cursor-pointer items-center hover:bg-zinc-50 pl-4"
			>
				<Checkbox checked={isChecked} />
				<div className="relative aspect-square items-center flex justify-center size-32">
					<EnhanceImage
						imagePath={image}
						filters={element.previewImg || []}
						className="h-full w-full object-contain rounded-md"
					/>
				</div>
				<div>
					<Content>{element.title}</Content>
					<Subtle>{element.description}</Subtle>
				</div>
			</div>
		);
	};

	return (
		<>
			{selected.length > 0 ? (
				<div className="flex gap-4 h-5 mb-1">
					<Subtle className="-mt-px">
						{deferredSelected.length} select
						{deferredSelected.length > 1 ? "s" : " "}
					</Subtle>
					<Badge
						onClick={() => setSelected([])}
						variant="outline"
						className="border-red-500 text-red-500 hover:text-white hover:bg-red-500"
					>
						Remove all
					</Badge>
					<Badge onClick={() => setSelected(input)} variant="outline">
						Select All
					</Badge>
				</div>
			) : (
				<div className="h-5 mb-1.5 -mt-0.5">
					<Badge onClick={() => setSelected(input)} variant="outline">
						Select All
					</Badge>
				</div>
			)}
			<div className="relative overflow-scroll max-h-[90%] flex flex-col gap-4">
				<List height={400} itemCount={input.length} itemSize={100} width="100%">
					{Row}
				</List>
			</div>
			<div className="mt-6">
				<DialogClose asChild>
					<Button
						type="submit"
						onClick={() => onAdd(selected)}
						className="ml-auto"
					>
						Apply
					</Button>
				</DialogClose>
			</div>
		</>
	);
};
