"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useModelStore } from "@/stores/modelStore";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ModelSettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ModelSettingsDialog({
	open,
	onOpenChange,
}: ModelSettingsDialogProps) {
	const {
		modelName,
		setModelName,
		modelPurpose,
		setModelPurpose,
		modelVersion,
		setModelVersion,
		autoSave,
		setAutoSave,
	} = useModelStore();

	const [localSettings, setLocalSettings] = useState({
		name: modelName,
		purpose: modelPurpose,
		version: modelVersion,
		autoSave: autoSave,
	});

	useEffect(() => {
		if (open) {
			setLocalSettings({
				name: modelName,
				purpose: modelPurpose,
				version: modelVersion,
				autoSave: autoSave,
			});
		}
	}, [open, modelName, modelPurpose, modelVersion, autoSave]);

	const handleSave = () => {
		setModelName(localSettings.name);
		setModelPurpose(localSettings.purpose);
		setModelVersion(localSettings.version);
		setAutoSave(localSettings.autoSave);
		onOpenChange(false);
	};

	const purposeOptions = [
		{ value: "General", label: "General Purpose" },
		{ value: "Classification", label: "Image Classification" },
		{ value: "ObjectDetection", label: "Object Detection" },
		{ value: "Segmentation", label: "Image Segmentation" },
		{ value: "NLP", label: "Natural Language Processing" },
		{ value: "TimeSeries", label: "Time Series Analysis" },
	];

	const showPurposeWarning = localSettings.purpose !== modelPurpose;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Model Settings</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="model-name">Model Name</Label>
						<Input
							id="model-name"
							value={localSettings.name}
							onChange={(e) =>
								setLocalSettings({ ...localSettings, name: e.target.value })
							}
							placeholder="Enter model name"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="model-purpose">Model Purpose</Label>
						<Select
							value={localSettings.purpose}
							onValueChange={(value) =>
								setLocalSettings({ ...localSettings, purpose: value })
							}
						>
							<SelectTrigger id="model-purpose">
								<SelectValue placeholder="Select purpose" />
							</SelectTrigger>
							<SelectContent>
								{purposeOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{showPurposeWarning && (
							<Alert variant="destructive" className="mt-2">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									Changing the model purpose may affect layer compatibility.
								</AlertDescription>
							</Alert>
						)}
					</div>

					<div className="grid gap-2">
						<Label htmlFor="model-version">Version</Label>
						<Input
							id="model-version"
							value={localSettings.version}
							onChange={(e) =>
								setLocalSettings({ ...localSettings, version: e.target.value })
							}
							placeholder="1.0.0"
						/>
					</div>

					<Separator className="my-2" />

					<div className="flex items-center justify-between">
						<Label htmlFor="auto-save" className="cursor-pointer">
							Auto-save configuration
						</Label>
						<Switch
							id="auto-save"
							checked={localSettings.autoSave}
							onCheckedChange={(checked) =>
								setLocalSettings({ ...localSettings, autoSave: checked })
							}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save Changes</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
