import type { LayerTemplate } from "./index";

export const convLayers: Record<string, LayerTemplate> = {
	conv2d: {
		name: "Conv2D Layer",
		description: "2D convolutional layer for image processing",
		category: "conv",
		purposes: ["feature_extraction", "image"],
		compatibleWith: [
			"classification",
			"objectdetection",
			"segmentation",
			"general",
		],
		config: {
			convolutionalLayer_filters: 32,
			convolutionalLayer_kernelSize: "(3, 3)",
			convolutionalLayer_strides: "(1, 1)",
			convolutionalLayer_padding: "same",
			convolutionalLayer_activation: "relu",
		},
	},
	maxpool2d: {
		name: "MaxPool2D Layer",
		description: "2D max pooling layer to reduce spatial dimensions",
		category: "conv",
		purposes: ["downsampling", "image"],
		compatibleWith: [
			"classification",
			"objectdetection",
			"segmentation",
			"general",
		],
		config: {
			poolingLayer_type: "MaxPool",
			poolingLayer_poolSize: "(2, 2)",
			poolingLayer_strides: "(2, 2)",
			poolingLayer_padding: "valid",
		},
	},
	avgpool2d: {
		name: "AvgPool2D Layer",
		description: "2D average pooling layer",
		category: "conv",
		purposes: ["downsampling", "image"],
		compatibleWith: [
			"classification",
			"objectdetection",
			"segmentation",
			"general",
		],
		config: {
			poolingLayer_type: "AvgPool",
			poolingLayer_poolSize: "(2, 2)",
			poolingLayer_strides: "(2, 2)",
			poolingLayer_padding: "valid",
		},
	},
	depthwise_conv2d: {
		name: "Depthwise Conv2D",
		description: "Depthwise separable convolution for efficient computation",
		category: "conv",
		purposes: ["feature_extraction", "image"],
		compatibleWith: [
			"classification",
			"objectdetection",
			"segmentation",
			"general",
		],
		config: {
			depthwiseConvLayer_kernelSize: "(3, 3)",
			depthwiseConvLayer_strides: "(1, 1)",
			depthwiseConvLayer_padding: "same",
			depthwiseConvLayer_depthMultiplier: 1,
			depthwiseConvLayer_activation: "relu",
		},
	},
	conv_transpose2d: {
		name: "Conv2D Transpose",
		description: "Transposed convolution for upsampling",
		category: "conv",
		purposes: ["upsampling", "image"],
		compatibleWith: ["segmentation", "general"],
		config: {
			convTransposeLayer_filters: 32,
			convTransposeLayer_kernelSize: "(3, 3)",
			convTransposeLayer_strides: "(2, 2)",
			convTransposeLayer_padding: "same",
			convTransposeLayer_activation: "relu",
		},
	},
};
