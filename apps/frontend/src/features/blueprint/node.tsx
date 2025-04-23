"use client";

import { FormBuilder } from "@/components/builder/form";
import { Subtle } from "@/components/typography/text";
import { Card } from "@/components/ui/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { node } from "@/configs/fields/image-preprocessing";
import { useDragStore } from "@/contexts/dragContext";
import usePreviousNodesData from "@/hooks/useRootNode";
import type { CustomNodeData } from "@/types/node";
import { RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Handle, Position } from "reactflow";
import { useShallow } from "zustand/react/shallow";

export default function CustomNode({
	data,
	id,
}: {
	data: CustomNodeData;
	id: string;
}) {
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
	const fields = useDragStore(useShallow((state) => state.fields));
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const input = useMemo(() => {
		return node(fields, onUpdateMetadata).find((field) => field.id === id);
	}, [fields, onUpdateMetadata, id]);
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<Card className="w-[280px] p-4 group group-hover:border-blue-400">
					{type !== "input" && (
						<Handle
							type="target"
							position={Position.Left}
							className="w-2 h-2 p-1.5"
						/>
					)}
					<div className="space-y-4">
						<div className="relative w-full h-32">
							<Image
								src={image || "/placeholder.svg"}
								alt={title}
								fill
								className="object-cover rounded-md border border-gray-50"
							/>
						</div>
						<div>
							<h3 className="font-semibold">{title}</h3>
							<p className="text-sm text-muted-foreground">{description}</p>
						</div>
						<div className="space-y-2 ">
							{/** Debug */}
							{/* {previousNodesData.length > 0 && (
								<div>
									<Label>All Nodes Data</Label>
									<pre className="p-2 bg-muted rounded-md text-xs overflow-scroll max-h-32">
										{JSON.stringify(previousNodesData, null, 2)}
									</pre>
								</div>
							)} */}
							<Subtle className="w-full border-b py-2">Config</Subtle>
							{input?.inputField && input?.inputSchema ? (
								<FormBuilder.Provider
									key={`form-${input.title}`}
									formName={`form-${input.title}`}
									schema={input.inputSchema}
								>
									<FormBuilder.Build
										formFields={input.inputField}
										schema={input.inputSchema}
									/>
								</FormBuilder.Provider>
							) : (
								<div>
									<Label>Current Value</Label>
									<Input
										value={value}
										onChange={(e) => onChange(e.target.value)}
										placeholder="Enter value..."
									/>
								</div>
							)}
						</div>
						{type === "condition" && (
							<div className="text-sm text-muted-foreground">
								Condition:{" "}
								{value ? `Value > ${value}` : "Set a threshold value"}
							</div>
						)}
					</div>
					{type !== "output" && (
						<Handle
							type="source"
							position={Position.Right}
							className="w-2 h-2 p-1.5"
						/>
					)}
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
					disabled={type === "output" || type === "input"}
					className="text-red-600 hover:cursor-pointer hover:bg-red-50 duration-150"
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete Node
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
