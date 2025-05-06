export function formatLayerName(key: string): string {
	const parts = key.split("_");
	if (parts.length > 1) {
		parts.shift();
	}

	return parts
		.join("_")
		.replace(/([A-Z])/g, " $1")
		.replace(/_/g, " ")
		.trim()
		.replace(/^\w/, (c) => c.toUpperCase());
}

export function getLayerType(layer: Record<string, any>): string {
	const keys = Object.keys(layer);
	if (keys.length === 0) return "Unknown";

	const firstKey = keys[0];

	if (firstKey.startsWith("inputLayer")) return "Input Layer";
	if (firstKey.startsWith("convolutionalLayer")) return "Convolutional Layer";
	if (firstKey.startsWith("poolingLayer")) return "Pooling Layer";
	if (firstKey.startsWith("flattenLayer")) return "Flatten Layer";
	if (firstKey.startsWith("denseLayer")) return "Dense Layer";
	if (firstKey.startsWith("normalizationLayer")) return "Normalization Layer";
	if (firstKey.startsWith("dropoutLayer")) return "Dropout Layer";
	if (firstKey.startsWith("batchNormLayer")) return "Batch Normalization";
	if (firstKey.startsWith("layerNormLayer")) return "Layer Normalization";
	if (firstKey.startsWith("lstmLayer")) return "LSTM Layer";
	if (firstKey.startsWith("gruLayer")) return "GRU Layer";
	if (firstKey.startsWith("yoloLayer")) return "YOLO Detection";
	if (firstKey.startsWith("ssdLayer")) return "SSD Detection";
	if (firstKey.startsWith("unetUpsampleLayer")) return "U-Net Upsampling";
	if (firstKey.startsWith("attentionLayer")) return "Attention Layer";
	if (firstKey.startsWith("custom_")) return "Custom Layer";

	// Add new layer type detection
	if (firstKey.startsWith("instanceNormLayer")) return "Instance Normalization";
	if (firstKey.startsWith("activationLayer")) return "Custom Activation";
	if (firstKey.startsWith("stochasticPoolLayer")) return "Stochastic Pooling";
	if (firstKey.startsWith("feedForwardLayer")) return "Feed Forward Network";
	if (firstKey.startsWith("sppLayer")) return "Spatial Pyramid Pooling";

	return "Custom Layer";
}

export function parseLayerConfig(
	layer: Record<string, any>,
): Record<string, any> {
	const processedLayer: Record<string, any> = {};

	for (const [key, value] of Object.entries(layer)) {
		if (
			typeof value === "string" &&
			((value.includes("[") && value.includes("]")) ||
				(value.includes("(") && value.includes(")")))
		) {
			processedLayer[key] = value
				.replace(/\[/g, "[")
				.replace(/\]/g, "]")
				.replace(/\(/g, "[")
				.replace(/\)/g, "]");
		} else {
			processedLayer[key] = value;
		}
	}

	return processedLayer;
}

export function getLayerPurposeColor(
	purpose: string,
	isBackground = false,
): string {
	const colors: Record<string, { bg: string; text: string }> = {
		general: { bg: "#f3f4f6", text: "#374151" },
		classification: { bg: "#dbeafe", text: "#1e40af" },
		detection: { bg: "#fef3c7", text: "#92400e" },
		segmentation: { bg: "#d1fae5", text: "#065f46" },
		sequence: { bg: "#e0e7ff", text: "#3730a3" },
		attention: { bg: "#fce7f3", text: "#9d174d" },
		memory: { bg: "#ede9fe", text: "#5b21b6" },
		normalization: { bg: "#fef3c7", text: "#92400e" },
		regularization: { bg: "#fee2e2", text: "#991b1b" },
		feature_extraction: { bg: "#dbeafe", text: "#1e40af" },
		downsampling: { bg: "#d1fae5", text: "#065f46" },
		upsampling: { bg: "#fce7f3", text: "#9d174d" },
		image: { bg: "#e0e7ff", text: "#3730a3" },
		regression: { bg: "#ede9fe", text: "#5b21b6" },
	};

	const defaultColor = { bg: "#f3f4f6", text: "#374151" };
	const color = colors[purpose.toLowerCase()] || defaultColor;

	return isBackground ? color.bg : color.text;
}
