"use client";

import { FormBuilder } from "@/components/builder/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDragStore } from "@/contexts/dragContext";
import type { DragColumn, Metadata } from "@/stores/dragStore";
import type { CustomNodeData } from "@/types/node";
import { X } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import type { ZodRawShape } from "zod";
import { useShallow } from "zustand/react/shallow";

interface VisualBoxProps {
	onClose: () => void;
	selectedNode: {
		data: CustomNodeData;
	} | null;
	node: (
		fields: DragColumn<ZodRawShape>[],
		onUpdateMetadata: (payload: {
			id: string;
			metadata: Metadata;
		}) => void,
	) => DragColumn[];
}

export default function VisualBox({
	selectedNode,
	onClose,
	node,
}: VisualBoxProps) {
	if (!selectedNode) {
		return null;
	}
	const { id, title, description, image, value, type } = selectedNode.data;
	const fields = useDragStore(useShallow((state) => state.fields));
	const onUpdateMetadata = useDragStore((state) => state.onUpdateMetadata);
	const input = useMemo(() => {
		return node(fields, onUpdateMetadata).find((field) => field.id === id);
	}, [fields, onUpdateMetadata, id, node]);
	return (
		<Card className="h-full">
			<CardHeader className="relative">
				<CardTitle>Node Details</CardTitle>
				<button
					type="button"
					className="absolute top-4 right-4 p-1 hover:bg-zinc-100"
					onClick={onClose}
				>
					<X className="w-5 h-5" />
				</button>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="relative w-full h-48">
					<Image
						src={image || "/placeholder.svg"}
						alt={title}
						fill
						className="object-cover rounded-md border border-gray-50"
					/>
				</div>
				<div className="space-y-2">
					<div>
						<Label>Type</Label>
						<Input
							value={type.charAt(0).toUpperCase() + type.slice(1)}
							readOnly
						/>
					</div>
					<div>
						<Label>Title</Label>
						<Input value={title} readOnly />
					</div>
					<div>
						<Label>Description</Label>
						<Textarea value={description} readOnly />
					</div>
					{input?.inputField && input?.inputSchema ? (
						<FormBuilder.Provider
							key={`form-${id}-visual`}
							formName={title}
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
							<Input value={value} readOnly />
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
