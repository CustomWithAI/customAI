"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useModelStore } from "@/stores/modelStore";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

function checkProperLayerSequence(layers: any[]): boolean {
	const inputIndex = layers.findIndex((layer) =>
		Object.keys(layer)[0]?.startsWith("inputLayer"),
	);
	const flattenIndex = layers.findIndex((layer) =>
		Object.keys(layer)[0]?.startsWith("flattenLayer"),
	);
	const denseIndex = layers.findIndex((layer) =>
		Object.keys(layer)[0]?.startsWith("denseLayer"),
	);

	if (flattenIndex !== -1 && denseIndex !== -1 && flattenIndex > denseIndex) {
		return false;
	}

	if (inputIndex !== -1 && inputIndex !== 0) {
		return false;
	}

	return true;
}

function checkAppropriateOutputUnits(layers: any[], purpose: string): boolean {
	const denseLayers = layers.filter((layer) =>
		Object.keys(layer)[0]?.startsWith("denseLayer"),
	);
	if (denseLayers.length === 0) return true;

	const lastDense = denseLayers[denseLayers.length - 1];
	if (purpose.toLowerCase().includes("class")) {
		return lastDense.denseLayer_units > 1;
	}

	return true;
}

export function ModelStats() {
	const { layers, getLayerCount, getTotalParameters, modelPurpose } =
		useModelStore();

	const layerCounts = getLayerCount();
	const totalParams = getTotalParameters();

	const layerCountData = Object.entries(layerCounts).map(([key, value]) => ({
		name: key.charAt(0).toUpperCase() + key.slice(1),
		count: value,
	}));

	const pieData = layerCountData.filter((item) => item.count > 0);

	const COLORS = [
		"#0088FE",
		"#00C49F",
		"#FFBB28",
		"#FF8042",
		"#8884d8",
		"#82ca9d",
	];

	const depth = layers.length;
	const hasInput = layers.some((layer) =>
		Object.keys(layer)[0]?.startsWith("inputLayer"),
	);
	const hasOutput = layers.some((layer) => {
		const keys = Object.keys(layer);
		return (
			keys[0]?.startsWith("denseLayer") &&
			layer.denseLayer_activation === "softmax"
		);
	});

	const modelSizeKB = Math.round((totalParams * 4) / 1024);

	const hasProperSequence = checkProperLayerSequence(layers);
	const hasSufficientDepth = layers.length >= 3;
	const hasAppropriateOutputUnits = checkAppropriateOutputUnits(
		layers,
		modelPurpose,
	);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Layers</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{layers.length}</div>
						<p className="text-xs text-muted-foreground">
							Network depth: {depth} layers
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Parameters</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalParams.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							Estimated size: ~{modelSizeKB} KB
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Model Status</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{hasInput &&
							hasOutput &&
							hasProperSequence &&
							hasAppropriateOutputUnits
								? "Complete"
								: "Incomplete"}
						</div>
						<div className="mt-2">
							<div className="flex items-center justify-between text-xs mb-1">
								<span>Model completeness</span>
								<span>
									{hasInput &&
									hasOutput &&
									hasProperSequence &&
									hasAppropriateOutputUnits
										? "100%"
										: `${Math.round(
												(hasInput ? 25 : 0) +
													(hasOutput ? 25 : 0) +
													(hasProperSequence ? 25 : 0) +
													(hasAppropriateOutputUnits ? 25 : 0),
											)}%`}
								</span>
							</div>
							<Progress
								value={
									(hasInput ? 25 : 0) +
									(hasOutput ? 25 : 0) +
									(hasProperSequence ? 25 : 0) +
									(hasAppropriateOutputUnits ? 25 : 0)
								}
							/>

							{/* Enhanced missing components section */}
							{(!hasInput ||
								!hasOutput ||
								!hasProperSequence ||
								!hasAppropriateOutputUnits ||
								!hasSufficientDepth) && (
								<div className="mt-3 text-xs space-y-1">
									<div className="font-medium text-sm text-amber-600 dark:text-amber-400">
										Missing or issues:
									</div>
									<ul className="list-disc list-inside space-y-1 text-muted-foreground">
										{!hasInput && (
											<li>Input layer (required to define input shape)</li>
										)}
										{!hasOutput && (
											<li>
												Output layer (dense layer with softmax/linear
												activation)
											</li>
										)}
										{!hasProperSequence && (
											<li>Improper layer sequence (check layer order)</li>
										)}
										{!hasAppropriateOutputUnits &&
											modelPurpose.toLowerCase().includes("class") && (
												<li>
													Output layer should have multiple units for
													classification
												</li>
											)}
										{!hasSufficientDepth && (
											<li>At least three layers recommended for most models</li>
										)}
										{!layers.some((layer) =>
											Object.keys(layer)[0]?.startsWith("convolutionalLayer"),
										) &&
											modelPurpose.toLowerCase().includes("class") && (
												<li>
													Convolutional layers recommended for image
													classification
												</li>
											)}
										{!layers.some((layer) =>
											Object.keys(layer)[0]?.startsWith("dropoutLayer"),
										) &&
											layers.length > 3 && (
												<li>
													Dropout layer recommended to prevent overfitting
												</li>
											)}
										{modelPurpose.toLowerCase().includes("object") &&
											!layers.some(
												(layer) =>
													Object.keys(layer)[0]?.startsWith("yoloLayer") ||
													Object.keys(layer)[0]?.startsWith("ssdLayer"),
											) && (
												<li>
													Detection head (YOLO/SSD) recommended for object
													detection
												</li>
											)}
									</ul>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Layer Types</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Object.values(layerCounts).filter((count) => count > 0).length}
						</div>
						<p className="text-xs text-muted-foreground">
							Different layer types used
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Architecture Recommendations
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 text-sm">
							{modelPurpose === "Classification" && (
								<div className="flex items-start gap-2">
									<div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
										<span className="text-blue-600 text-xs">i</span>
									</div>
									<div>
										<span className="font-medium">Classification model:</span>{" "}
										Recommended structure includes convolutional layers followed
										by flatten, dense, and dropout layers.
									</div>
								</div>
							)}

							{modelPurpose === "ObjectDetection" && (
								<div className="flex items-start gap-2">
									<div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
										<span className="text-blue-600 text-xs">i</span>
									</div>
									<div>
										<span className="font-medium">Object Detection model:</span>{" "}
										Should include a backbone (like ResNet) and a detection head
										(YOLO/SSD).
									</div>
								</div>
							)}

							{modelPurpose === "Segmentation" && (
								<div className="flex items-start gap-2">
									<div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
										<span className="text-blue-600 text-xs">i</span>
									</div>
									<div>
										<span className="font-medium">Segmentation model:</span>{" "}
										Consider U-Net architecture with encoder-decoder structure
										and skip connections.
									</div>
								</div>
							)}

							{modelPurpose === "NLP" && (
								<div className="flex items-start gap-2">
									<div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
										<span className="text-blue-600 text-xs">i</span>
									</div>
									<div>
										<span className="font-medium">NLP model:</span> Should
										include embedding layers and recurrent (LSTM/GRU) or
										transformer layers.
									</div>
								</div>
							)}

							{/* General recommendations */}
							<div className="flex items-start gap-2">
								<div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
									<span className="text-blue-600 text-xs">i</span>
								</div>
								<div>
									<span className="font-medium">Regularization:</span>{" "}
									{layers.some((layer) =>
										Object.keys(layer)[0]?.startsWith("dropoutLayer"),
									)
										? "Good! Your model includes dropout for regularization."
										: "Consider adding dropout layers to prevent overfitting."}
								</div>
							</div>

							<div className="flex items-start gap-2">
								<div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
									<span className="text-blue-600 text-xs">i</span>
								</div>
								<div>
									<span className="font-medium">Normalization:</span>{" "}
									{layers.some(
										(layer) =>
											Object.keys(layer)[0]?.startsWith("batchNormLayer") ||
											Object.keys(layer)[0]?.startsWith("layerNormLayer"),
									)
										? "Good! Your model includes normalization layers."
										: "Consider adding batch normalization to improve training stability."}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Layer Distribution</CardTitle>
						<CardDescription>Count of each layer type</CardDescription>
					</CardHeader>
					<CardContent className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={layerCountData}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Bar dataKey="count" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Layer Composition</CardTitle>
						<CardDescription>Proportion of layer types</CardDescription>
					</CardHeader>
					<CardContent className="h-[300px]">
						{pieData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={pieData}
										cx="50%"
										cy="50%"
										labelLine={false}
										outerRadius={80}
										fill="#8884d8"
										dataKey="count"
										label={({ name, percent }) =>
											`${name} ${(percent * 100).toFixed(0)}%`
										}
									>
										{pieData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className="flex items-center justify-center h-full text-muted-foreground">
								No data to display
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
