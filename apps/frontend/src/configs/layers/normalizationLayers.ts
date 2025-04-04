import type { LayerTemplate } from "./index";

export const normalizationLayers: Record<string, LayerTemplate> = {
	batch_norm: {
		name: "Batch Normalization",
		description: "Normalizes activations of the previous layer",
		category: "normalization",
		purposes: ["normalization", "regularization"],
		compatibleWith: ["all"],
		config: {
			normalizationLayer_type: "BatchNormalization",
			normalizationLayer_axis: -1,
			normalizationLayer_momentum: 0.99,
			normalizationLayer_epsilon: 0.001,
			normalizationLayer_center: true,
			normalizationLayer_scale: true,
		},
	},
	layer_norm: {
		name: "Layer Normalization",
		description: "Normalizes across features for each sample",
		category: "normalization",
		purposes: ["normalization"],
		compatibleWith: ["all"],
		config: {
			normalizationLayer_type: "LayerNormalization",
			normalizationLayer_axis: -1,
			normalizationLayer_epsilon: 0.001,
			normalizationLayer_center: true,
			normalizationLayer_scale: true,
		},
	},
	group_norm: {
		name: "Group Normalization",
		description: "Normalizes across groups of channels",
		category: "normalization",
		purposes: ["normalization"],
		compatibleWith: ["all"],
		config: {
			normalizationLayer_type: "GroupNormalization",
			normalizationLayer_groups: 32,
			normalizationLayer_axis: -1,
			normalizationLayer_epsilon: 0.001,
			normalizationLayer_center: true,
			normalizationLayer_scale: true,
		},
	},
};
