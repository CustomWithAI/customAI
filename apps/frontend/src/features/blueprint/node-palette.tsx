"use client";

import { ContentHeader, Italic, SubHeader } from "@/components/typography/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDragStore } from "@/contexts/dragContext";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import {
	type DragEvent,
	type ReactElement,
	cloneElement,
	use,
	useMemo,
} from "react";
import type { ZodRawShape } from "zod";

type NodePaletteProps = {
	noTitle?: boolean;
	onPickUp?: () => void;
	node: (
		fields: DragColumn<ZodRawShape>[],
		onUpdateMetadata: (payload: {
			id: string;
			metadata: Metadata;
		}) => void,
	) => DragColumn[];
};
export default function NodePalette({
	noTitle = false,
	onPickUp,
	node,
}: NodePaletteProps) {
	const fields = useDragStore((state) => state.fields);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
		onPickUp ? onPickUp() : undefined;
	};
	const input = useMemo(() => {
		return node(fields, onUpdateMetadata);
	}, [fields, onUpdateMetadata, node]);

	return (
		<Card className="flex flex-col h-full">
			{!noTitle && (
				<CardHeader>
					<CardTitle>Node Palette</CardTitle>
				</CardHeader>
			)}
			<CardContent className="flex-1 space-y-4 h-full overflow-scroll">
				{input.map((node) => (
					<div
						key={node.type}
						className="p-4 border rounded-lg cursor-move hover:bg-accent hover:shadow-md duration-150"
						draggable
						onDragStart={(e) => onDragStart(e, node.type as string)}
					>
						<div className="flex items-start space-x-4">
							<div className="relative mt-2 p-1 w-8 h-8 rounded-lg bg-blue-50 flex-shrink-0">
								{cloneElement(node.icon as ReactElement, {
									className: "w-6 h-6 text-blue-700",
								})}
							</div>
							<div>
								<ContentHeader className="text-base font-semibold">
									{node.title}
								</ContentHeader>
								<Italic className="text-sm text-muted-foreground">
									{node.description}
								</Italic>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
