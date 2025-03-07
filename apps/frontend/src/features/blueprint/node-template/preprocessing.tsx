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
import EnhanceImage from "@/components/ui/enhanceImage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { node } from "@/configs/image-preprocessing";
import { useDragStore } from "@/contexts/dragContext";
import usePreviousNodesData from "@/hooks/useRootNode";
import type { CustomNodeData } from "@/types/node";
import useStableMemo, { useStableArray } from "@/utils/stable-array";
import { RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
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
		const result = node(fields, onUpdateMetadata).find(
			(field) => field.id === id,
		);
		return result ? { ...result } : undefined;
	}, [fields, onUpdateMetadata, id]);

	const stableInputPreviewImg = useMemo(
		() => input?.previewImg || [],
		[input?.previewImg],
	);

	const previousPreviewImgParams = useStableMemo(() => {
		return [
			...node(fields, onUpdateMetadata)
				.filter((elem) => previousNodesData.map((d) => d.id).includes(elem.id))
				.flatMap((field) => field.previewImg)
				.filter((f) => f !== undefined),
			...stableInputPreviewImg,
		];
	}, [previousNodesData, stableInputPreviewImg, fields, onUpdateMetadata]);

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
						<div className="relative aspect-video w-full h-32">
							{image && (
								<EnhanceImage
									imagePath={image}
									filters={previousPreviewImgParams}
									className="object-cover w-full h-32 rounded-md border border-gray-50"
								/>
							)}
						</div>
						<div>
							<h3 className="font-semibold">{title}</h3>
							<p className="text-sm text-muted-foreground">{description}</p>
						</div>
						<div className="space-y-2 ">
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
							) : null}
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
