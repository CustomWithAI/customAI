"use client";

import { Card } from "@/components/ui/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import usePreviousNodesData from "@/hooks/useRootNode";
import { RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { Handle, Position, useEdges, useNodes } from "reactflow";

export type CustomNodeData = {
	title: string;
	description: string;
	image: string;
	value: string;
	type: string;
	onChange: (value: string) => void;
	onDelete?: () => void;
	onReset?: () => void;
};

export default function CustomNode({
	data,
	id,
}: { data: CustomNodeData; id: string }) {
	const {
		title,
		description,
		image,
		value,
		type,
		onChange,
		onDelete,
		onReset,
	} = data;
	const previousNodesData = usePreviousNodesData(id);
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<Card className="w-[280px] p-4">
					<Handle
						type="target"
						position={Position.Left}
						className="w-2 h-2 p-1.5"
					/>
					<div className="space-y-4">
						<div className="relative w-full h-32">
							<Image
								src={image || "/placeholder.svg"}
								alt={title}
								fill
								className="object-cover rounded-md"
							/>
						</div>
						<div>
							<h3 className="font-semibold">{title}</h3>
							<p className="text-sm text-muted-foreground">{description}</p>
						</div>
						<div className="space-y-2">
							{previousNodesData.length > 0 && (
								<div>
									<Label>All Nodes Data</Label>
									<pre className="p-2 bg-muted rounded-md text-xs overflow-auto max-h-32">
										{JSON.stringify(previousNodesData, null, 2)}
									</pre>
								</div>
							)}
							<div>
								<Label>Current Value</Label>
								<Input
									value={value}
									onChange={(e) => onChange(e.target.value)}
									placeholder="Enter value..."
								/>
							</div>
						</div>
						{type === "condition" && (
							<div className="text-sm text-muted-foreground">
								Condition:{" "}
								{value ? `Value > ${value}` : "Set a threshold value"}
							</div>
						)}
					</div>
					<Handle
						type="source"
						position={Position.Right}
						className="w-2 h-2 p-1.5"
					/>
				</Card>
			</ContextMenuTrigger>
			<ContextMenuContent className="bg-white">
				<ContextMenuItem
					onClick={onReset}
					className="hover:cursor-pointer hover:bg-zinc-50 duration-150"
				>
					<RefreshCw className="mr-2 h-4 w-4" />
					Reset Value
				</ContextMenuItem>
				<ContextMenuItem
					onClick={onDelete}
					className="text-red-600 hover:cursor-pointer hover:bg-red-50 duration-150"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete Node
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
