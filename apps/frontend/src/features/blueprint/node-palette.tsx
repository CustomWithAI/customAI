"use client";

import { ContentHeader, Italic, SubHeader } from "@/components/typography/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDragStore } from "@/contexts/dragContext";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import {
	type DragEvent,
	type ReactElement,
	cloneElement,
	memo,
	use,
	useMemo,
} from "react";
import type { ZodRawShape } from "zod";
import { useShallow } from "zustand/react/shallow";
import { NodeItem } from "./node-palette-card";

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
const NodePalette = memo(
	({ noTitle = false, onPickUp, node }: NodePaletteProps) => {
		const fields = useDragStore(useShallow((state) => state.fields));
		const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);

		const onDragStart = (
			event: DragEvent<HTMLDivElement>,
			nodeType: string,
		) => {
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
						<NodeItem
							key={node.type}
							type={node.type}
							icon={node.icon}
							title={node.title}
							description={node.description}
							onDragStart={(e) => onDragStart(e, node.type as string)}
						/>
					))}
				</CardContent>
			</Card>
		);
	},
);

export default NodePalette;
