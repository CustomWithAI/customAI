import type { LayerTemplate } from "./index";

export const customLayers: Record<string, LayerTemplate> = {
	// Example of a custom attention mechanism layer
	multihead_attention: {
		name: "Multi-Head Attention",
		description:
			"Custom attention mechanism with multiple heads for sequence processing",
		category: "specialized",
		purposes: ["attention", "sequence"],
		compatibleWith: ["nlp", "general"],
		config: {
			attentionLayer_numHeads: 8,
			attentionLayer_keyDim: 64,
			attentionLayer_valueDim: 64,
			attentionLayer_dropout: 0.1,
			attentionLayer_useCausalMask: false,
			attentionLayer_useRelativePosition: true,
			attentionLayer_maxRelativePosition: 32,
		},
	},

	// Example of a custom normalization layer
	instance_norm: {
		name: "Instance Normalization",
		description:
			"Normalizes across spatial dimensions for each channel and each sample",
		category: "normalization",
		purposes: ["normalization"],
		compatibleWith: ["all"],
		config: {
			instanceNormLayer_epsilon: 0.001,
			instanceNormLayer_center: true,
			instanceNormLayer_scale: true,
			instanceNormLayer_beta_initializer: "zeros",
			instanceNormLayer_gamma_initializer: "ones",
		},
	},

	// Example of a custom activation layer
	custom_activation: {
		name: "Custom Activation Layer",
		description: "Applies a custom activation function to the input",
		category: "basic",
		purposes: ["general"],
		compatibleWith: ["all"],
		config: {
			activationLayer_type: "mish", // Custom activation type
			activationLayer_alpha: 1.0,
			activationLayer_beta: 1.0,
			activationLayer_threshold: 0.0,
		},
	},

	// Example of a custom pooling layer
	stochastic_pooling: {
		name: "Stochastic Pooling",
		description:
			"Probabilistic pooling method that addresses overfitting issues",
		category: "conv",
		purposes: ["downsampling", "regularization"],
		compatibleWith: [
			"classification",
			"objectdetection",
			"segmentation",
			"general",
		],
		config: {
			stochasticPoolLayer_poolSize: "(2, 2)",
			stochasticPoolLayer_strides: "(2, 2)",
			stochasticPoolLayer_padding: "valid",
			stochasticPoolLayer_temperature: 1.0,
		},
	},

	// Example of a custom layer for transformers
	feed_forward: {
		name: "Feed Forward Network",
		description:
			"Position-wise feed-forward network used in transformer architectures",
		category: "specialized",
		purposes: ["general", "sequence"],
		compatibleWith: ["nlp", "general"],
		config: {
			feedForwardLayer_dimHidden: 2048,
			feedForwardLayer_dimOutput: 512,
			feedForwardLayer_activation: "relu",
			feedForwardLayer_dropout: 0.1,
			feedForwardLayer_useLayerNorm: true,
		},
	},

	// Example of a custom layer for computer vision
	spatial_pyramid_pooling: {
		name: "Spatial Pyramid Pooling",
		description:
			"Pools features at multiple spatial scales for fixed-length representation",
		category: "specialized",
		purposes: ["feature_extraction", "image"],
		compatibleWith: ["classification", "objectdetection", "general"],
		config: {
			sppLayer_levels: [1, 2, 4],
			sppLayer_poolType: "max",
			sppLayer_implementation: "fast",
		},
	},
};
