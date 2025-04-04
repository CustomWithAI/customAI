"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { layerTemplates } from "@/configs/layers";
import { useModelStore } from "@/stores/modelStore";
import { getLayerPurposeColor } from "@/utils/layer-utils";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface AddLayerDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddLayerDialog({ open, onOpenChange }: AddLayerDialogProps) {
	const { addLayer, modelPurpose, addCustomLayer, customLayerTemplates } =
		useModelStore();
	const [selectedCategory, setSelectedCategory] = useState<string>("basic");

	const [customLayerName, setCustomLayerName] = useState("");
	const [customLayerPurpose, setCustomLayerPurpose] = useState("general");
	const [customLayerParams, setCustomLayerParams] = useState<
		Array<{ name: string; type: string }>
	>([]);

	const categories = [
		{ id: "custom", name: "Custom" },
		{ id: "basic", name: "Basic" },
		{ id: "conv", name: "Convolutional" },
		{ id: "recurrent", name: "Recurrent" },
		{ id: "normalization", name: "Normalization" },
		{ id: "specialized", name: "Specialized" },
	];

	const handleAddLayer = (templateId: string) => {
		addLayer(templateId);
		onOpenChange(false);
	};

	const addCustomParam = () => {
		setCustomLayerParams([...customLayerParams, { name: "", type: "string" }]);
	};

	const removeCustomParam = (index: number) => {
		setCustomLayerParams(customLayerParams.filter((_, i) => i !== index));
	};

	const handleCustomParamChange = (
		index: number,
		field: "name" | "type",
		value: string,
	) => {
		const updatedParams = [...customLayerParams];
		updatedParams[index][field] = value;
		setCustomLayerParams(updatedParams);
	};

	const handleCreateCustomLayer = () => {
		if (!customLayerName || customLayerParams.length === 0) return;

		const layerId = `custom_${customLayerName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;

		const layerConfig: Record<string, any> = {};

		for (const param of customLayerParams) {
			const paramKey = `custom_${param.name.toLowerCase().replace(/\s+/g, "_")}`;

			let defaultValue: any = "";
			if (param.type === "number") defaultValue = 0;
			if (param.type === "boolean") defaultValue = false;

			layerConfig[paramKey] = defaultValue;
		}

		addCustomLayer(layerId, customLayerName, customLayerPurpose, layerConfig);

		setCustomLayerName("");
		setCustomLayerPurpose("general");
		setCustomLayerParams([]);

		onOpenChange(false);
	};

	const allTemplates = {
		...layerTemplates,
		...customLayerTemplates,
	};

	const filteredTemplates = Object.entries(allTemplates)
		.filter(([id, template]) => template.category === selectedCategory)
		.filter(
			([id, template]) =>
				template.compatibleWith.includes("all") ||
				template.compatibleWith.includes(modelPurpose.toLowerCase()),
		);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Add Layer</DialogTitle>
				</DialogHeader>

				<Tabs
					defaultValue="basic"
					value={selectedCategory}
					onValueChange={setSelectedCategory}
					className="flex-1 flex flex-col overflow-hidden"
				>
					<TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
						{categories.map((category) => (
							<TabsTrigger key={category.id} value={category.id}>
								{category.name}
							</TabsTrigger>
						))}
					</TabsList>

					{categories.map((category) => (
						<TabsContent
							key={category.id}
							value={category.id}
							className="flex-1 overflow-hidden"
						>
							<ScrollArea className="h-[400px] pr-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{filteredTemplates.length > 0 ? (
										filteredTemplates.map(([id, template]) => (
											<Card key={id} className="overflow-hidden">
												<CardHeader className="pb-2">
													<CardTitle className="text-sm font-medium flex items-center justify-between">
														{template.name}
														{template.purposes.map((purpose: string) => (
															<Badge
																key={purpose}
																variant="outline"
																style={{
																	backgroundColor: getLayerPurposeColor(
																		purpose,
																		true,
																	),
																	color: getLayerPurposeColor(purpose, false),
																}}
															>
																{purpose}
															</Badge>
														))}
													</CardTitle>
													<CardDescription className="text-xs">
														{template.description}
													</CardDescription>
												</CardHeader>
												<CardFooter className="pt-2">
													<Button
														size="sm"
														onClick={() => handleAddLayer(id)}
														className="w-full"
													>
														Add Layer
													</Button>
												</CardFooter>
											</Card>
										))
									) : (
										<div className="col-span-2 text-center py-8 text-muted-foreground">
											No compatible layers found for {modelPurpose} models in
											this category.
										</div>
									)}
								</div>
							</ScrollArea>
						</TabsContent>
					))}
					<TabsContent
						key="custom"
						value="custom"
						className="flex-1 overflow-hidden"
					>
						<div className="space-y-4">
							<div className="bg-muted p-4 rounded-md">
								<h3 className="font-medium mb-2">Create Custom Layer</h3>
								<div className="space-y-4">
									<div className="grid gap-2">
										<Label htmlFor="custom-layer-name">Layer Name</Label>
										<Input
											id="custom-layer-name"
											value={customLayerName}
											onChange={(e) => setCustomLayerName(e.target.value)}
											placeholder="My Custom Layer"
										/>
									</div>

									<div className="grid gap-2">
										<Label htmlFor="custom-layer-purpose">Layer Purpose</Label>
										<Select
											value={customLayerPurpose}
											onValueChange={setCustomLayerPurpose}
										>
											<SelectTrigger id="custom-layer-purpose">
												<SelectValue placeholder="Select purpose" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="general">General</SelectItem>
												<SelectItem value="feature_extraction">
													Feature Extraction
												</SelectItem>
												<SelectItem value="classification">
													Classification
												</SelectItem>
												<SelectItem value="detection">Detection</SelectItem>
												<SelectItem value="segmentation">
													Segmentation
												</SelectItem>
												<SelectItem value="normalization">
													Normalization
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Parameters</Label>
										<div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
											{customLayerParams.map((param, index) => (
												<div
													key={index}
													className="flex items-center gap-2 bg-background p-2 rounded-md"
												>
													<Input
														value={param.name}
														onChange={(e) =>
															handleCustomParamChange(
																index,
																"name",
																e.target.value,
															)
														}
														placeholder="Parameter name"
														className="flex-1"
													/>
													<Select
														value={param.type}
														onValueChange={(value) =>
															handleCustomParamChange(index, "type", value)
														}
													>
														<SelectTrigger className="w-[100px]">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="string">String</SelectItem>
															<SelectItem value="number">Number</SelectItem>
															<SelectItem value="boolean">Boolean</SelectItem>
														</SelectContent>
													</Select>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => removeCustomParam(index)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={addCustomParam}
											className="w-full mt-2"
										>
											<Plus className="h-4 w-4 mr-1" /> Add Parameter
										</Button>
									</div>

									<Button
										onClick={handleCreateCustomLayer}
										disabled={
											!customLayerName || customLayerParams.length === 0
										}
										className="w-full"
									>
										Create Layer
									</Button>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
