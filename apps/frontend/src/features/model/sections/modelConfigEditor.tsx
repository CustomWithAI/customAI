"use client";

import { RenderStatusAlert } from "@/components/common/alertStatus";
import { Accordion } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModelConfig } from "@/hooks/use-model-config";
import { type LayerConfig, useModelStore } from "@/stores/modelStore";
import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Download, FileCode, Plus, Save, Settings, Upload } from "lucide-react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { AddLayerDialog } from "../components/dialogs/addLayerDialog";
import { LayerTemplateDialog } from "../components/dialogs/layerTemplateDialog";
import { ModelSettingsDialog } from "../components/dialogs/modelSettingsDialog";
import { LayerEditor } from "../components/layerEditor";
import { ModelStats } from "../components/modelStats";
import { ModelVisualizer } from "../components/modelVisualizer";

export type ModelConfigStatus = "idle" | "loading" | "success" | "error";

export interface ModelConfigData {
	name: string;
	purpose: string;
	version: string;
	layers: LayerConfig[];
}

interface ModelConfigEditorProps {
	modelType?: string;
	defaultValue?: Partial<ModelConfigData>;
	status?: ModelConfigStatus;
	statusMessage?: string;
	onExport?: (data: LayerConfig[]) => void;
	onImport?: (data: LayerConfig[]) => boolean | Promise<boolean>;
}

export interface ModelConfigRef {
	getData: () => ModelConfigData;
}

export const ModelConfigEditor = forwardRef<
	ModelConfigRef,
	ModelConfigEditorProps
>(
	(
		{
			modelType = "General",
			defaultValue,
			status = "idle",
			statusMessage,
			onExport,
			onImport,
		},
		ref,
	) => {
		const {
			layers,
			removeLayer,
			updateLayer,
			modelPurpose,
			setModelPurpose,
			modelName,
			modelVersion,
			setModelName,
			setModelVersion,
			setLayers,
		} = useModelStore();

		const [addLayerOpen, setAddLayerOpen] = useState(false);
		const [settingsOpen, setSettingsOpen] = useState(false);
		const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

		const { handleImport, handleExport, isLoading, error } = useModelConfig({
			onExportCallback: onExport,
			onImportCallback: onImport,
		});

		useImperativeHandle(ref, () => {
			const modelData: ModelConfigData = {
				name: modelName,
				purpose: modelPurpose,
				version: modelVersion,
				layers: layers,
			};
			return {
				getData: () => modelData,
			};
		});

		useEffect(() => {
			if (defaultValue) {
				if (defaultValue.name) setModelName(defaultValue.name);
				if (defaultValue.purpose) setModelPurpose(defaultValue.purpose);
				if (defaultValue.version) setModelVersion(defaultValue.version);
				if (defaultValue.layers && defaultValue.layers.length > 0) {
					setLayers(defaultValue.layers);
				}
			}
		}, [
			defaultValue,
			setModelName,
			setModelPurpose,
			setModelVersion,
			setLayers,
		]);

		useEffect(() => {
			if (modelType !== "General" && modelType !== modelPurpose) {
				setModelPurpose(modelType);
			}
		}, [modelType, modelPurpose, setModelPurpose]);

		const sensors = useSensors(
			useSensor(PointerSensor),
			useSensor(KeyboardSensor, {
				coordinateGetter: sortableKeyboardCoordinates,
			}),
		);

		const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;

			if (over && active.id !== over.id) {
				const oldIndex = Number.parseInt(active.id.toString().split("-")[1]);
				const newIndex = Number.parseInt(over.id.toString().split("-")[1]);

				const newLayers = arrayMove(layers, oldIndex, newIndex);
				setLayers(newLayers);
			}
		};

		return (
			<div className="-mt-14 space-y-4 md:space-y-6">
				<div className="flex flex-wrap items-center gap-2 justify-end">
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={() => setAddLayerOpen(true)}
							variant="default"
							size="sm"
						>
							<Plus className="w-4 h-4 mr-1" /> Add Layer
						</Button>
						<Button
							onClick={handleImport}
							variant="outline"
							size="sm"
							disabled={isLoading || status === "loading"}
						>
							<Upload className="w-4 h-4 mr-1" /> Import
						</Button>
						<Button
							onClick={handleExport}
							variant="outline"
							size="sm"
							disabled={isLoading || status === "loading"}
						>
							<Download className="w-4 h-4 mr-1" /> Export
						</Button>
					</div>
				</div>

				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Tabs defaultValue="editor" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="editor">Editor</TabsTrigger>
						<TabsTrigger value="visualizer">Visualizer</TabsTrigger>
						<TabsTrigger value="stats">Statistics</TabsTrigger>
					</TabsList>

					<TabsContent value="editor" className="space-y-4 md:space-y-6 pt-4">
						{layers.length > 0 ? (
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={layers.map((_, index) => `layer-${index}`)}
									strategy={verticalListSortingStrategy}
								>
									<Accordion type="multiple" className="w-full space-y-2">
										{layers.map((layer, index) => (
											<LayerEditor
												key={`layer-${index}`}
												id={`layer-${index}`}
												index={index}
												layer={layer}
												onUpdate={(updatedLayer) =>
													updateLayer(index, updatedLayer)
												}
												onRemove={() => removeLayer(index)}
											/>
										))}
									</Accordion>
								</SortableContext>
							</DndContext>
						) : (
							<RenderStatusAlert status={status} statusMessage={statusMessage}>
								<div className="text-center py-8 text-muted-foreground border rounded-md border-gray-200">
									No layers added yet. Click the &quot;Add Layer&quot; button to
									get started.
								</div>
							</RenderStatusAlert>
						)}
					</TabsContent>

					<TabsContent value="visualizer" className="pt-4">
						<ModelVisualizer />
					</TabsContent>

					<TabsContent value="stats" className="pt-4">
						<ModelStats />
					</TabsContent>
				</Tabs>

				<AddLayerDialog open={addLayerOpen} onOpenChange={setAddLayerOpen} />
				<ModelSettingsDialog
					open={settingsOpen}
					onOpenChange={setSettingsOpen}
				/>
				<LayerTemplateDialog
					open={templateDialogOpen}
					onOpenChange={setTemplateDialogOpen}
				/>
			</div>
		);
	},
);
