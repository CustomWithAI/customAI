"use client";

import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { LayerConfig } from "@/stores/modelStore";
import { formatLayerName, getLayerType } from "@/utils/layer-utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface LayerEditorProps {
	id: string;
	index: number;
	layer: LayerConfig;
	onUpdate: (layer: LayerConfig) => void;
	onRemove: () => void;
	canCustomize?: boolean;
}

export function LayerEditor({
	id,
	index,
	layer: rawLayer,
	onUpdate,
	onRemove,
	canCustomize = false,
}: LayerEditorProps) {
	const { name, layer } = useMemo(() => {
		const { name, ...rest } = rawLayer;
		return {
			name,
			layer: rest,
		};
	}, [rawLayer]);

	const [currentLayer, setCurrentLayer] = useState<LayerConfig>(layer);

	const [customParamName, setCustomParamName] = useState("");
	const [customParamType, setCustomParamType] = useState<
		"string" | "number" | "boolean"
	>("string");

	useEffect(() => {
		setCurrentLayer(layer);
	}, [layer]);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 50 : "auto",
	};

	const handleInputChange = (key: string, value: any) => {
		const updatedLayer = { ...currentLayer };

		if (typeof currentLayer[key] === "number") {
			updatedLayer[key] = Number(value);
		} else if (typeof currentLayer[key] === "boolean") {
			updatedLayer[key] = value;
		} else if (
			typeof currentLayer[key] === "string" &&
			(currentLayer[key].includes("(") || value.includes("("))
		) {
			updatedLayer[key] = value;
		} else {
			updatedLayer[key] = value;
		}

		setCurrentLayer(updatedLayer);
		onUpdate(updatedLayer);
	};

	const renderInput = (key: string, value: any) => {
		if (typeof value === "boolean") {
			return (
				<div className="flex items-center space-x-2" key={key}>
					<Switch
						id={`${index}-${key}`}
						checked={value}
						onCheckedChange={(checked) => handleInputChange(key, checked)}
					/>
					<Label htmlFor={`${index}-${key}`}>{formatLayerName(key)}</Label>
				</div>
			);
		}

		if (key.includes("activation")) {
			return (
				<div className="grid gap-2" key={key}>
					<Label htmlFor={`${index}-${key}`}>{formatLayerName(key)}</Label>
					<Select
						value={String(value)}
						onValueChange={(val) => handleInputChange(key, val)}
					>
						<SelectTrigger id={`${index}-${key}`}>
							<SelectValue placeholder="Select activation" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="relu">ReLU</SelectItem>
							<SelectItem value="sigmoid">Sigmoid</SelectItem>
							<SelectItem value="tanh">Tanh</SelectItem>
							<SelectItem value="softmax">Softmax</SelectItem>
							<SelectItem value="linear">Linear</SelectItem>
						</SelectContent>
					</Select>
				</div>
			);
		}

		if (key.includes("padding")) {
			return (
				<div className="grid gap-2" key={key}>
					<Label htmlFor={`${index}-${key}`}>{formatLayerName(key)}</Label>
					<Select
						value={String(value)}
						onValueChange={(val) => handleInputChange(key, val)}
					>
						<SelectTrigger id={`${index}-${key}`}>
							<SelectValue placeholder="Select padding" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="same">Same</SelectItem>
							<SelectItem value="valid">Valid</SelectItem>
						</SelectContent>
					</Select>
				</div>
			);
		}

		if (key === "poolingLayer_type") {
			return (
				<div className="grid gap-2" key={key}>
					<Label htmlFor={`${index}-${key}`}>{formatLayerName(key)}</Label>
					<Select
						value={String(value)}
						onValueChange={(val) => handleInputChange(key, val)}
					>
						<SelectTrigger id={`${index}-${key}`}>
							<SelectValue placeholder="Select pool type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="MaxPool">Max Pool</SelectItem>
							<SelectItem value="AvgPool">Average Pool</SelectItem>
						</SelectContent>
					</Select>
				</div>
			);
		}

		return (
			<div className="grid gap-2" key={key}>
				<Label htmlFor={`${index}-${key}`}>{formatLayerName(key)}</Label>
				<Input
					id={`${index}-${key}`}
					value={value}
					onChange={(e) => handleInputChange(key, e.target.value)}
				/>
			</div>
		);
	};

	const handleAddCustomParam = () => {
		if (!customParamName.trim()) return;

		const paramKey = `custom_${customParamName.trim().replace(/\s+/g, "_").toLowerCase()}`;

		if (currentLayer[paramKey] !== undefined) {
			alert(`Parameter '${customParamName}' already exists!`);
			return;
		}

		let defaultValue: any = "";
		if (customParamType === "number") defaultValue = 0;
		if (customParamType === "boolean") defaultValue = false;

		const updatedLayer = {
			...currentLayer,
			[paramKey]: defaultValue,
		};

		setCurrentLayer(updatedLayer);
		onUpdate(updatedLayer);

		setCustomParamName("");
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="relative"
			data-dragging={isDragging ? "true" : undefined}
		>
			<AccordionItem value={`item-${index}`} className="border rounded-md">
				<div className="flex items-center">
					<div
						className="px-2 z-10 cursor-grab active:cursor-grabbing touch-none"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						{...attributes}
						{...listeners}
					>
						<GripVertical className="h-4 w-4 text-muted-foreground" />
					</div>
					<AccordionTrigger className="flex-1 px-4">
						Layer {index + 1}: {name}
					</AccordionTrigger>
					<Button
						variant="ghost"
						size="icon"
						className="mr-4"
						onClick={(e) => {
							e.stopPropagation();
							onRemove();
						}}
					>
						<Trash2 className="h-4 w-4" />
						<span className="sr-only">Remove layer</span>
					</Button>
				</div>
				<AccordionContent className="px-4 pb-4 pt-1">
					<div className="grid gap-4">
						{Object.entries(currentLayer).map(([key, value]) => {
							if (key === "layerPurpose") return;
							return renderInput(key, value);
						})}
					</div>

					{canCustomize && (
						<div className="mt-4 pt-2 border-t border-gray-200">
							<h4 className="text-sm font-medium mb-2">Custom Parameters</h4>
							<div className="flex items-center gap-2">
								<Input
									placeholder="Parameter name"
									value={customParamName}
									onChange={(e) => setCustomParamName(e.target.value)}
									className="flex-1"
								/>
								<Select
									value={customParamType}
									onValueChange={setCustomParamType as any}
								>
									<SelectTrigger className="w-[120px]">
										<SelectValue placeholder="Type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="string">String</SelectItem>
										<SelectItem value="number">Number</SelectItem>
										<SelectItem value="boolean">Boolean</SelectItem>
									</SelectContent>
								</Select>
								<Button
									variant="outline"
									size="sm"
									onClick={handleAddCustomParam}
									disabled={!customParamName.trim()}
								>
									Add
								</Button>
							</div>
						</div>
					)}
				</AccordionContent>
			</AccordionItem>
		</div>
	);
}
