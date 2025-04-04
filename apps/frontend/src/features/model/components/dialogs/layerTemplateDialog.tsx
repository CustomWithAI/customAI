"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useModelStore } from "@/stores/modelStore";
import { useState } from "react";
import { LayerConfigBuilder } from "../layerConfigBuilder";

interface LayerTemplateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function LayerTemplateDialog({
	open,
	onOpenChange,
}: LayerTemplateDialogProps) {
	const [activeTab, setActiveTab] = useState<string>("create");
	const { customLayerTemplates } = useModelStore();

	const handleSaveTemplate = ({
		id,
		template,
	}: { id: string; template: any }) => {
		useModelStore
			.getState()
			.addCustomLayer(id, template.name, template.purposes[0], template.config);

		toast({
			title: "Template Created",
			description: `Layer template "${template.name}" has been created successfully.`,
		});

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Layer Template Manager</DialogTitle>
				</DialogHeader>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="flex-1 flex flex-col overflow-hidden"
				>
					<TabsList className="grid grid-cols-2">
						<TabsTrigger value="create">Create Template</TabsTrigger>
						<TabsTrigger value="manage">Manage Templates</TabsTrigger>
					</TabsList>

					<TabsContent value="create" className="flex-1 overflow-auto">
						<LayerConfigBuilder onSave={handleSaveTemplate} />
					</TabsContent>

					<TabsContent value="manage" className="flex-1 overflow-auto">
						<div className="space-y-4">
							<h3 className="font-medium">Custom Layer Templates</h3>

							{Object.keys(customLayerTemplates).length > 0 ? (
								<div className="space-y-2">
									{Object.entries(customLayerTemplates).map(
										([id, template]) => (
											<div key={id} className="border rounded-md p-3">
												<div className="flex justify-between items-center">
													<h4 className="font-medium">{template.name}</h4>
													<div className="flex gap-2">
														{/* Add edit/delete buttons here in the future */}
													</div>
												</div>
												<p className="text-sm text-muted-foreground">
													{template.description}
												</p>
											</div>
										),
									)}
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									No custom templates created yet. Use the "Create Template" tab
									to create your first template.
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
