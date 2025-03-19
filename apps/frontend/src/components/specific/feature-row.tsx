import type { DragColumn } from "@/stores/dragStore";
import { type KeyboardEvent, memo, useEffect } from "react";
import { Content, Subtle } from "../typography/text";
import { Checkbox } from "../ui/checkbox";
import EnhanceImage from "../ui/enhanceImage";

export const Row = memo(
	({
		element,
		handleKeyDown,
		image,
		isChecked,
		toggleSelection,
		style,
	}: {
		element: DragColumn;
		image: string;
		isChecked: boolean;
		handleKeyDown: (
			e: KeyboardEvent<HTMLDivElement>,
			element: DragColumn,
		) => void;
		toggleSelection: (element: DragColumn) => void;
		style?: React.CSSProperties;
	}) => {
		const filters = element.previewImg || [];
		return (
			<div
				style={style}
				onKeyDown={(e) => handleKeyDown(e, element)}
				onClick={() => toggleSelection(element)}
				className="flex gap-x-8 hover:cursor-pointer items-center hover:bg-zinc-50 pl-4"
			>
				<Checkbox checked={isChecked} />
				<div className="relative aspect-square items-center flex justify-center size-32">
					<EnhanceImage
						imagePath={image}
						filters={filters}
						className="h-full w-full object-contain rounded-md"
					/>
				</div>
				<div>
					<Content>{element.title}</Content>
					<Subtle>{element.description}</Subtle>
				</div>
			</div>
		);
	},
);
