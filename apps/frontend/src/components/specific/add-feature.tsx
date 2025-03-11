"use client";
import { Content, Subtle } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@/components/ui/dialog";
import EnhanceImage from "@/components/ui/enhanceImage";
import { useDragStore } from "@/contexts/dragContext";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import useStableMemo, { useStableArray } from "@/utils/stable-array";
import {
	type KeyboardEvent,
	type ReactNode,
	memo,
	useCallback,
	useDeferredValue,
	useState,
} from "react";
import { FixedSizeList as List, areEqual } from "react-window";
import type { z } from "zod";
import { Row } from "./feature-row";

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

	const input = useStableMemo(() => {
		return node(fields, onUpdateMetadata);
	}, [fields, onUpdateMetadata, node]);

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

	if (!image) {
		return;
	}

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
				<List
					height={400}
					itemCount={input.length}
					itemData={input}
					itemSize={100}
					width="100%"
				>
					{({ data, index, style }) => {
						const element = data[index];
						const isChecked = deferredSelected.some(
							(item) => item.id === element.id,
						);
						return (
							<Row
								key={element.id}
								image={image}
								isChecked={isChecked}
								handleKeyDown={handleKeyDown}
								toggleSelection={toggleSelection}
								style={style}
								element={element}
							/>
						);
					}}
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
