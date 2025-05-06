"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useModelStore } from "@/stores/modelStore";
import { getLayerType } from "@/utils/layer-utils";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";

export function ModelVisualizer() {
	const { layers } = useModelStore();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const layerColors = {
		"Input Layer": "#3498db",
		"Convolutional Layer": "#e74c3c",
		"Pooling Layer": "#2ecc71",
		"Flatten Layer": "#f39c12",
		"Dense Layer": "#9b59b6",
		"Dropout Layer": "#34495e",
		"Custom Layer": "#7f8c8d",
	};

	useEffect(() => {
		if (!canvasRef.current || layers.length === 0) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const padding = 20;
		const layerSpacing = Math.min(
			80,
			(canvas.width - padding * 2) / Math.max(layers.length, 1),
		);
		const startX = padding;
		const endX = canvas.width - padding;
		const centerY = canvas.height / 2;

		ctx.strokeStyle = "#ccc";
		ctx.lineWidth = 2;

		for (let i = 0; i < layers.length - 1; i++) {
			const x1 = startX + i * layerSpacing + 30;
			const x2 = startX + (i + 1) * layerSpacing;

			ctx.beginPath();
			ctx.moveTo(x1, centerY);
			ctx.lineTo(x2, centerY);
			ctx.stroke();
		}

		layers.forEach((layer, index) => {
			const x = startX + index * layerSpacing;
			const layerType = layer?.name || getLayerType(layer);
			const color =
				layerColors[layerType as keyof typeof layerColors] ||
				layerColors["Custom Layer"];

			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x, centerY, 15, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = "#333";
			ctx.font = "12px Arial";
			ctx.textAlign = "center";
			ctx.fillText(`Layer ${index + 1}`, x, centerY + 30);

			ctx.font = "10px Arial";
			ctx.fillText(layerType.split(" ")[0], x, centerY + 45);

			if (
				layerType === "Convolutional Layer" &&
				layer.convolutionalLayer_filters
			) {
				ctx.fillText(
					`${layer.convolutionalLayer_filters} filters`,
					x,
					centerY + 60,
				);
			} else if (layerType === "Dense Layer" && layer.denseLayer_units) {
				ctx.fillText(`${layer.denseLayer_units} units`, x, centerY + 60);
			} else if (layerType === "Dropout Layer" && layer.dropoutLayer_rate) {
				ctx.fillText(`${layer.dropoutLayer_rate * 100}%`, x, centerY + 60);
			}
		});
	}, [layers]);

	if (layers.length === 0) {
		return (
			<Alert>
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>
					No layers added yet. Add some layers in the Editor tab to visualize
					your model.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Neural Network Architecture</CardTitle>
					<CardDescription>Visual representation of your model</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="border border-gray-200 rounded-md p-4 bg-white">
						<canvas
							ref={canvasRef}
							className="w-full"
							style={{ height: "300px" }}
						/>
					</div>
					<div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
						{Object.entries(layerColors).map(([type, color]) => (
							<div key={type} className="flex items-center text-xs">
								<div
									className="w-3 h-3 rounded-full mr-1"
									style={{ backgroundColor: color }}
								/>
								<span>{type.replace(" Layer", "")}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Layer Information</CardTitle>
					<CardDescription>
						Details about each layer in your model
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{layers.map((layer, index) => {
							const layerType = getLayerType(layer);
							const color =
								layerColors[layerType as keyof typeof layerColors] ||
								layerColors["Custom Layer"];

							return (
								<div
									key={index}
									className="flex items-start border-l-4 border-gray-200 pl-4 py-2"
									style={{ borderColor: color }}
								>
									<div>
										<h4 className="font-medium">
											Layer {index + 1}: {layer?.name || layerType}
										</h4>
										<div className="text-sm text-muted-foreground mt-1">
											{Object.entries(layer).map(([key, value]) => (
												<div key={key} className="grid grid-cols-2 gap-2">
													<span>{key.split("_")[1] || key}:</span>
													<span>{String(value)}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
