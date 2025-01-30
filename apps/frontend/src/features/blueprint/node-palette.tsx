"use client";

import { ContentHeader, Italic, SubHeader } from "@/components/typography/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { node } from "@/configs/image-preprocessing";
import { useDragStore } from "@/contexts/dragContext";
import { type DragEvent, type ReactElement, cloneElement, use } from "react";

type NodePaletteProps = {
	noTitle?: boolean;
	onPickUp?: () => void;
};
export default function NodePalette({
	noTitle = false,
	onPickUp,
}: NodePaletteProps) {
	const fields = useDragStore((state) => state.fields);
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
		onPickUp ? onPickUp() : undefined;
	};

	return (
		<Card className="h-full">
			{!noTitle && (
				<CardHeader>
					<CardTitle>Node Palette</CardTitle>
				</CardHeader>
			)}
			<CardContent className="space-y-4">
				{node(fields, onUpdateMetadata).map((node) => (
					<div
						key={node.type}
						className="p-4 border rounded-lg cursor-move hover:bg-accent"
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
