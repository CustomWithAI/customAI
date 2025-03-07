"use client";
import { Content, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@/components/ui/dialog";
import EnhanceImage from "@/components/ui/enhanceImage";
import { node } from "@/configs/augmentation";
import { useDragStore } from "@/contexts/dragContext";
import type { DragColumn } from "@/stores/dragStore";
import { type KeyboardEvent, useCallback, useMemo, useState } from "react";

export const AddFeatureSection = ({ image }: { image?: string }) => {
	const onAdd = useDragStore((state) => state.onAdd);
	const fields = useDragStore((state) => state.fields);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const [selected, setSelected] = useState<DragColumn[]>([]);
	const input = useMemo(() => {
		return node(fields, onUpdateMetadata);
	}, [fields, onUpdateMetadata]);

	const onCheckboxClick = useCallback((element: DragColumn) => {
		setSelected((prev) =>
			prev.some((item) => item.id === element.id)
				? prev.filter((item) => item.id !== element.id)
				: [...prev, element],
		);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>, element: DragColumn) => {
			if (event.key === "Enter" || event.key === " ") {
				onCheckboxClick(element);
			}
		},
		[onCheckboxClick],
	);
	return (
		<>
			<div className="h-3">a</div>
			<div className="overflow-scroll max-h-[90%] flex flex-col gap-4">
				{input.map((element) => (
					<div
						key={element.title}
						onKeyDown={(e) => handleKeyDown(e, element)}
						onClick={() => {
							onCheckboxClick(element);
						}}
						className="flex gap-x-8 hover:cursor-pointer items-center hover:bg-zinc-50 pl-4"
					>
						<Checkbox
							checked={selected.some((item) => item.id === element.id)}
						/>
						<div className="relative aspect-square items-center flex justify-center size-32 ">
							<EnhanceImage
								imagePath={image || ""}
								filters={element.previewImg || []}
								className="h-full w-full object-contain rounded-md"
							/>
						</div>
						<div>
							<Content>{element.title}</Content>
							<Subtle>{element.description}</Subtle>
						</div>
					</div>
				))}
			</div>
			<div className="mt-6">
				<DialogClose asChild>
					<Button onClick={() => onAdd(selected)} className="ml-auto">
						Apply
					</Button>
				</DialogClose>
			</div>
		</>
	);
};
