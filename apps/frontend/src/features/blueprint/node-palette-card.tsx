import { ContentHeader, Italic } from "@/components/typography/text";
import type { DragColumn } from "@/stores/dragStore";
import { type DragEvent, type ReactElement, cloneElement, memo } from "react";

type NodeItem = {
	type: DragColumn["type"];
	title: DragColumn["title"];
	description: DragColumn["description"];
	icon: DragColumn["icon"];
	onDragStart: (e: DragEvent<HTMLDivElement>, type: string) => void;
};
export const NodeItem = memo(
	({ type, icon, title, description, onDragStart }: NodeItem) => (
		<div
			className="p-4 border rounded-lg cursor-move hover:bg-accent hover:shadow-md duration-150"
			draggable
			onDragStart={(e) => onDragStart(e, type as string)}
		>
			<div className="flex items-start space-x-4">
				<div className="relative mt-2 p-1 w-8 h-8 rounded-lg bg-blue-50 shrink-0">
					{cloneElement(icon as ReactElement, {
						className: "w-6 h-6 text-blue-700",
					})}
				</div>
				<div>
					<ContentHeader className="text-base font-semibold">
						{title}
					</ContentHeader>
					<Italic className="text-sm text-muted-foreground">
						{description}
					</Italic>
				</div>
			</div>
		</div>
	),
);
