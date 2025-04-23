import type { LayerTemplate } from "./index";

export const basicLayers: Record<string, LayerTemplate> = {
	input: {
		name: "Input Layer",
		description: "Defines the input shape for your model",
		category: "basic",
		purposes: ["general"],
		compatibleWith: ["all"],
		config: {
			inputLayer_batchSize: 32,
			// inputLayer_shape: "(224, 224, 3)",
		},
	},
	dense: {
		name: "Dense Layer",
		description: "Fully connected layer with configurable units",
		category: "basic",
		purposes: ["general", "classification"],
		compatibleWith: ["all"],
		config: {
			denseLayer_units: 128,
			denseLayer_activation: "relu",
			// denseLayer_useBias: true,
		},
	},
	dropout: {
		name: "Dropout Layer",
		description: "Prevents overfitting by randomly setting inputs to zero",
		category: "basic",
		purposes: ["general", "regularization"],
		compatibleWith: ["all"],
		config: {
			dropoutLayer_rate: 0.5,
		},
	},
	flatten: {
		name: "Flatten Layer",
		description: "Flattens the input to 1D for dense layers",
		category: "basic",
		purposes: ["general"],
		compatibleWith: ["all"],
		config: {
			flattenLayer: true,
		},
	},
	output_classification: {
		name: "Classification Output",
		description: "Output layer for classification tasks",
		category: "basic",
		purposes: ["classification"],
		compatibleWith: ["classification", "general"],
		config: {
			denseLayer_units: 10,
			denseLayer_activation: "softmax",
			denseLayer_useBias: true,
			denseLayer_isOutput: true,
		},
	},
	output_regression: {
		name: "Regression Output",
		description: "Output layer for regression tasks",
		category: "basic",
		purposes: ["regression"],
		compatibleWith: ["general"],
		config: {
			denseLayer_units: 1,
			denseLayer_activation: "linear",
			denseLayer_useBias: true,
			denseLayer_isOutput: true,
		},
	},
	normalization: {
		name: "Batch Normalization",
		description: "Normalizes activations for improved training stability",
		category: "basic",
		purposes: ["normalization"],
		compatibleWith: ["all"],
		config: {
			normalizationLayer_type: "BatchNormalization",
			normalizationLayer_momentum: 0.9,
			normalizationLayer_epsilon: 0.001,
		},
	},
};
