"use client";
import { Content, Subtle } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@/components/ui/dialog";
import { node } from "@/configs/image-preprocessing";
import { useDragStore } from "@/contexts/dragContext";
import { cn } from "@/libs/utils";
import type { DragColumn } from "@/stores/dragStore";
import { generateId } from "@/utils/generate-id";
import Image from "next/image";
import { useMemo, useState } from "react";

export const AddFeatureSection = () => {
	const onAdd = useDragStore((state) => state.onAdd);
	const fields = useDragStore((state) => state.fields);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const [selected, setSelected] = useState<DragColumn[]>([]);
	const input = useMemo(() => {
		return node(fields, onUpdateMetadata);
	}, [fields, onUpdateMetadata]);
	return (
		<>
			<div className="overflow-scroll max-h-[90%] flex flex-col gap-4">
				{input.map((element) => (
					<div key={element.title} className="flex gap-x-8 items-center">
						<Checkbox
							checked={Boolean(selected.find((item) => item.id === element.id))}
							onCheckedChange={() => setSelected((prev) => [...prev, element])}
						/>
						<div className="relative aspect-square size-32 ">
							<Image
								fill
								priority
								alt={`${element.title}-previewImage`}
								src={element.imagePreviewUrl || ""}
								className={cn(
									"border border-gray-100 rounded-lg",
									element.previewClassName,
								)}
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
