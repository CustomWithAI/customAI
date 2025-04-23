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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { layerTemplates } from "@/configs/layers";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useModelStore } from "@/stores/modelStore";
import { ilikeArrayFilter } from "@/utils/ilikeArray";
import { getLayerPurposeColor } from "@/utils/layer-utils";
import { toText } from "@/utils/toCapital";
import { Search } from "lucide-react";
import { useState } from "react";

interface AddLayerDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddLayerDialog({ open, onOpenChange }: AddLayerDialogProps) {
	const { addLayer, modelPurpose, addCustomLayer, customLayerTemplates } =
		useModelStore();
	const [selectedCategory, setSelectedCategory] = useState<string>("basic");
	const [filterName, setFilterName] = useState<string>("");

	const categories = [
		{ id: "basic", name: "Basic" },
		{ id: "conv", name: "Convolutional" },
		{ id: "recurrent", name: "Recurrent" },
		{ id: "normalization", name: "Normalization" },
		{ id: "specialized", name: "Specialized" },
	];

	const handleAddLayer = (templateId: string) => {
		addLayer(templateId);
	};

	const allTemplates = {
		...layerTemplates,
		...customLayerTemplates,
	};

	const filteredTemplates = Object.entries(allTemplates)
		.filter(([_, template]) => template.category === selectedCategory)
		.filter(
			([_, template]) =>
				template.compatibleWith.includes("all") ||
				template.compatibleWith.includes(modelPurpose.toLowerCase()),
		)
		.filter(
			([_, template]) =>
				!filterName.trim() ||
				template.name.toLowerCase().includes(filterName.toLowerCase()),
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
							className="flex-1 overflow-hidden space-y-2"
						>
							<div className="relative">
								<Input
									type="text"
									placeholder="find layer node.."
									value={filterName}
									onChange={(v) => setFilterName(v.target.value)}
									className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
								/>
								<div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
									<Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
								</div>
							</div>
							<ScrollArea className="h-[400px] pr-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{filteredTemplates.length > 0 ? (
										filteredTemplates.map(([id, template]) => (
											<Card key={id} className="overflow-hidden">
												<CardHeader className="pb-2">
													<CardTitle className="text-sm font-medium flex flex-col justify-between">
														{template.name}
														<div className="flex gap-1 mt-1 flex-warp">
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
														</div>
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
											No compatible layers found for {toText(modelPurpose)}{" "}
											models in this category.
										</div>
									)}
								</div>
							</ScrollArea>
						</TabsContent>
					))}
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
