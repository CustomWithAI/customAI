"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLayerPurposeColor } from "@/utils/layer-utils";
import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

interface LayerConfigBuilderProps {
	onSave?: (config: { id: string; template: any }) => void;
}

export function LayerConfigBuilder({ onSave }: LayerConfigBuilderProps) {
	const [layerName, setLayerName] = useState("");
	const [layerDescription, setLayerDescription] = useState("");
	const [layerCategory, setLayerCategory] = useState("custom");
	const [layerPurpose, setLayerPurpose] = useState("general");
	const [compatibleWith, setCompatibleWith] = useState<string[]>(["all"]);
	const [parameters, setParameters] = useState<
		Array<{
			name: string;
			type: "string" | "number" | "boolean" | "select";
			defaultValue: any;
			options?: string[];
		}>
	>([]);

	const [paramName, setParamName] = useState("");
	const [paramType, setParamType] = useState<
		"string" | "number" | "boolean" | "select"
	>("string");
	const [paramDefaultValue, setParamDefaultValue] = useState<any>("");
	const [paramOptions, setParamOptions] = useState<string[]>([]);
	const [paramOptionInput, setParamOptionInput] = useState("");

	const categories = [
		{ id: "basic", name: "Basic" },
		{ id: "conv", name: "Convolutional" },
		{ id: "recurrent", name: "Recurrent" },
		{ id: "normalization", name: "Normalization" },
		{ id: "specialized", name: "Specialized" },
		{ id: "custom", name: "Custom" },
	];

	const purposes = [
		{ id: "general", name: "General Purpose" },
		{ id: "classification", name: "Classification" },
		{ id: "detection", name: "Object Detection" },
		{ id: "segmentation", name: "Segmentation" },
		{ id: "feature_extraction", name: "Feature Extraction" },
		{ id: "normalization", name: "Normalization" },
		{ id: "regularization", name: "Regularization" },
		{ id: "attention", name: "Attention" },
	];

	const compatibilityOptions = [
		{ id: "all", name: "All Models" },
		{ id: "classification", name: "Classification" },
		{ id: "objectdetection", name: "Object Detection" },
		{ id: "segmentation", name: "Segmentation" },
		{ id: "nlp", name: "NLP" },
		{ id: "timeseries", name: "Time Series" },
	];

	const addParameter = () => {
		if (!paramName.trim()) return;

		const newParam = {
			name: paramName.trim(),
			type: paramType,
			defaultValue: paramDefaultValue,
			...(paramType === "select" && { options: [...paramOptions] }),
		};

		setParameters([...parameters, newParam]);

		setParamName("");
		setParamType("string");
		setParamDefaultValue("");
		setParamOptions([]);
	};

	const removeParameter = (index: number) => {
		setParameters(parameters.filter((_, i) => i !== index));
	};

	const addOptionToSelect = () => {
		if (!paramOptionInput.trim()) return;
		setParamOptions([...paramOptions, paramOptionInput.trim()]);
		setParamOptionInput("");
	};

	const removeOption = (index: number) => {
		setParamOptions(paramOptions.filter((_, i) => i !== index));
	};

	const toggleCompatibility = (value: string) => {
		if (value === "all") {
			setCompatibleWith(["all"]);
			return;
		}

		let newCompatible = compatibleWith.filter((c) => c !== "all");

		if (newCompatible.includes(value)) {
			newCompatible = newCompatible.filter((c) => c !== value);
		} else {
			newCompatible.push(value);
		}

		if (newCompatible.length === 0) {
			newCompatible = ["all"];
		}

		setCompatibleWith(newCompatible);
	};

	const handleSave = () => {
		if (!layerName.trim() || parameters.length === 0) return;

		const templateId = `custom_${layerName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;

		const layerConfig: Record<string, any> = {};
		for (const param of parameters) {
			const paramKey = `${layerCategory}_${param.name.toLowerCase().replace(/\s+/g, "_")}`;
			layerConfig[paramKey] = param.defaultValue;
		}

		const template = {
			name: layerName,
			description: layerDescription || `Custom ${layerName} layer`,
			category: layerCategory,
			purposes: [layerPurpose],
			compatibleWith: compatibleWith,
			config: layerConfig,
			parameterDefs: parameters,
		};

		if (onSave) {
			onSave({ id: templateId, template });
		}

		setLayerName("");
		setLayerDescription("");
		setLayerCategory("custom");
		setLayerPurpose("general");
		setCompatibleWith(["all"]);
		setParameters([]);
	};

	const renderDefaultValueInput = () => {
		switch (paramType) {
			case "string":
				return (
					<Input
						value={paramDefaultValue}
						onChange={(e) => setParamDefaultValue(e.target.value)}
						placeholder="Default value"
					/>
				);
			case "number":
				return (
					<Input
						type="number"
						value={paramDefaultValue}
						onChange={(e) => setParamDefaultValue(Number(e.target.value))}
						placeholder="0"
					/>
				);
			case "boolean":
				return (
					<div className="flex items-center space-x-2">
						<Switch
							checked={!!paramDefaultValue}
							onCheckedChange={setParamDefaultValue}
							id="param-default-bool"
						/>
						<Label htmlFor="param-default-bool">
							Default: {paramDefaultValue ? "True" : "False"}
						</Label>
					</div>
				);
			case "select":
				return (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Input
								value={paramOptionInput}
								onChange={(e) => setParamOptionInput(e.target.value)}
								placeholder="Add option"
								className="flex-1"
							/>
							<Button variant="outline" size="sm" onClick={addOptionToSelect}>
								<Plus className="h-4 w-4" />
							</Button>
						</div>

						{paramOptions.length > 0 && (
							<div className="bg-muted p-2 rounded-md">
								<div className="text-xs text-muted-foreground mb-1">
									Options:
								</div>
								<div className="flex flex-wrap gap-1">
									{paramOptions.map((option, idx) => (
										<Badge
											key={idx}
											variant="secondary"
											className="flex items-center gap-1"
										>
											{option}
											<button
												onClick={() => removeOption(idx)}
												className="h-3 w-3 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 flex items-center justify-center"
											>
												<span className="sr-only">Remove</span>
												<Trash2 className="h-2 w-2" />
											</button>
										</Badge>
									))}
								</div>
							</div>
						)}

						{paramOptions.length > 0 && (
							<div className="mt-2">
								<Label htmlFor="param-default-select">Default Value</Label>
								<Select
									value={paramDefaultValue}
									onValueChange={setParamDefaultValue}
								>
									<SelectTrigger id="param-default-select">
										<SelectValue placeholder="Select default" />
									</SelectTrigger>
									<SelectContent>
										{paramOptions.map((option, idx) => (
											<SelectItem key={idx} value={option}>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Layer Template Builder</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="basic" className="space-y-4">
						<TabsList>
							<TabsTrigger value="basic">Basic Info</TabsTrigger>
							<TabsTrigger value="parameters">Parameters</TabsTrigger>
							<TabsTrigger value="preview">Preview</TabsTrigger>
						</TabsList>

						<TabsContent value="basic" className="space-y-4">
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="layer-name">Layer Name</Label>
									<Input
										id="layer-name"
										value={layerName}
										onChange={(e) => setLayerName(e.target.value)}
										placeholder="e.g., Custom Attention Layer"
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="layer-description">Description</Label>
									<Input
										id="layer-description"
										value={layerDescription}
										onChange={(e) => setLayerDescription(e.target.value)}
										placeholder="Brief description of the layer"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="layer-category">Category</Label>
										<Select
											value={layerCategory}
											onValueChange={setLayerCategory}
										>
											<SelectTrigger id="layer-category">
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="grid gap-2">
										<Label htmlFor="layer-purpose">Primary Purpose</Label>
										<Select
											value={layerPurpose}
											onValueChange={setLayerPurpose}
										>
											<SelectTrigger id="layer-purpose">
												<SelectValue placeholder="Select purpose" />
											</SelectTrigger>
											<SelectContent>
												{purposes.map((purpose) => (
													<SelectItem key={purpose.id} value={purpose.id}>
														{purpose.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="grid gap-2">
									<Label>Compatible With</Label>
									<div className="flex flex-wrap gap-2">
										{compatibilityOptions.map((option) => (
											<Badge
												key={option.id}
												variant={
													compatibleWith.includes(option.id)
														? "default"
														: "outline"
												}
												className="cursor-pointer"
												onClick={() => toggleCompatibility(option.id)}
											>
												{option.name}
											</Badge>
										))}
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										Click to toggle compatibility with different model types
									</p>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="parameters" className="space-y-4">
							<div className="space-y-4">
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="param-name">Parameter Name</Label>
										<Input
											id="param-name"
											value={paramName}
											onChange={(e) => setParamName(e.target.value)}
											placeholder="e.g., units, filters, rate"
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="grid gap-2">
											<Label htmlFor="param-type">Parameter Type</Label>
											<Select
												value={paramType}
												onValueChange={(val: any) => setParamType(val)}
											>
												<SelectTrigger id="param-type">
													<SelectValue placeholder="Select type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="string">String</SelectItem>
													<SelectItem value="number">Number</SelectItem>
													<SelectItem value="boolean">Boolean</SelectItem>
													<SelectItem value="select">
														Select (Dropdown)
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="grid gap-2">
											<Label>Default Value</Label>
											{renderDefaultValueInput()}
										</div>
									</div>

									<Button
										onClick={addParameter}
										disabled={
											!paramName.trim() ||
											(paramType === "select" && paramOptions.length === 0)
										}
									>
										<Plus className="h-4 w-4 mr-1" /> Add Parameter
									</Button>
								</div>

								{parameters.length > 0 && (
									<div className="border rounded-md p-4 space-y-2">
										<h3 className="font-medium">Parameters</h3>
										<div className="space-y-2">
											{parameters.map((param, index) => (
												<div
													key={index}
													className="flex items-center justify-between bg-muted p-2 rounded-md"
												>
													<div>
														<span className="font-medium">{param.name}</span>
														<span className="text-xs text-muted-foreground ml-2">
															({param.type}
															{param.type === "select"
																? `, ${param.options?.length} options`
																: ""}
															)
														</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="text-sm">
															Default:{" "}
															{param.type === "boolean"
																? param.defaultValue
																	? "True"
																	: "False"
																: String(param.defaultValue)}
														</span>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => removeParameter(index)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</TabsContent>

						<TabsContent value="preview" className="space-y-4">
							{layerName ? (
								<div className="space-y-4">
									<div className="border rounded-md p-4">
										<div className="flex items-center justify-between mb-2">
											<h3 className="font-medium text-lg">{layerName}</h3>
											<Badge
												variant="outline"
												style={{
													backgroundColor: getLayerPurposeColor(
														layerPurpose,
														true,
													),
													color: getLayerPurposeColor(layerPurpose, false),
												}}
											>
												{purposes.find((p) => p.id === layerPurpose)?.name ||
													layerPurpose}
											</Badge>
										</div>

										<p className="text-muted-foreground mb-4">
											{layerDescription || `Custom ${layerName} layer`}
										</p>

										<div className="grid gap-2">
											<div className="flex items-center justify-between text-sm">
												<span>Category:</span>
												<span>
													{categories.find((c) => c.id === layerCategory)
														?.name || layerCategory}
												</span>
											</div>

											<div className="flex items-center justify-between text-sm">
												<span>Compatible with:</span>
												<div className="flex flex-wrap gap-1 justify-end">
													{compatibleWith.map((c) => (
														<Badge
															key={c}
															variant="secondary"
															className="text-xs"
														>
															{compatibilityOptions.find((o) => o.id === c)
																?.name || c}
														</Badge>
													))}
												</div>
											</div>
										</div>

										<div className="mt-4 pt-4 border-t">
											<h4 className="font-medium mb-2">Parameters</h4>
											{parameters.length > 0 ? (
												<div className="space-y-2">
													{parameters.map((param, index) => (
														<div
															key={index}
															className="grid grid-cols-3 gap-2 text-sm"
														>
															<span className="font-medium">{param.name}</span>
															<span className="text-muted-foreground">
																{param.type}
															</span>
															<span className="text-right">
																Default:{" "}
																{param.type === "boolean"
																	? param.defaultValue
																		? "True"
																		: "False"
																	: String(param.defaultValue || "-")}
															</span>
														</div>
													))}
												</div>
											) : (
												<p className="text-muted-foreground text-sm">
													No parameters defined yet
												</p>
											)}
										</div>
									</div>

									<Button
										onClick={handleSave}
										disabled={!layerName.trim() || parameters.length === 0}
										className="w-full"
									>
										<Save className="h-4 w-4 mr-1" /> Save Layer Template
									</Button>
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									Fill in the basic information and parameters to preview your
									layer template
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
