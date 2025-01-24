"use client";

import { ContentHeader, Italic, SubHeader } from "@/components/typography/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownUp, ChevronsLeftRightEllipsis, Cog } from "lucide-react";
import Image from "next/image";
import { type DragEvent, type ReactElement, cloneElement } from "react";

const nodeTypes = [
	{
		type: "condition",
		title: "Condition Node",
		description: "Evaluates a condition and routes the flow",
		icon: <ArrowDownUp />,
	},
	{
		type: "process",
		title: "Process Node",
		description: "Processes the input value",
		icon: <Cog />,
	},
	{
		type: "output",
		title: "Output Node",
		description: "Displays the final output",
		icon: <ChevronsLeftRightEllipsis />,
	},
];

export default function NodePalette() {
	const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>Node Palette</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{nodeTypes.map((node) => (
					<div
						key={node.type}
						className="p-4 border rounded-lg cursor-move hover:bg-accent"
						draggable
						onDragStart={(e) => onDragStart(e, node.type)}
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
