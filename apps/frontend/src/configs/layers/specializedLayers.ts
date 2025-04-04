import type { LayerTemplate } from "./index";

export const specializedLayers: Record<string, LayerTemplate> = {
	yolo_detection: {
		name: "YOLO Detection Head",
		description: "Detection head for YOLO object detection",
		category: "specialized",
		purposes: ["detection"],
		compatibleWith: ["objectdetection"],
		config: {
			yoloLayer_anchors: "[(10, 13), (16, 30), (33, 23)]",
			yoloLayer_numClasses: 80,
			yoloLayer_iouThreshold: 0.5,
			yoloLayer_scoreThreshold: 0.5,
		},
	},
	ssd_detection: {
		name: "SSD Detection Head",
		description: "Detection head for SSD object detection",
		category: "specialized",
		purposes: ["detection"],
		compatibleWith: ["objectdetection"],
		config: {
			ssdLayer_numClasses: 80,
			ssdLayer_aspectRatios: "[1.0, 2.0, 0.5]",
			ssdLayer_minScale: 0.2,
			ssdLayer_maxScale: 0.9,
		},
	},
	unet_upsampling: {
		name: "U-Net Upsampling Block",
		description: "Upsampling block for U-Net segmentation",
		category: "specialized",
		purposes: ["segmentation"],
		compatibleWith: ["segmentation"],
		config: {
			unetUpsampleLayer_filters: 64,
			unetUpsampleLayer_kernelSize: "(3, 3)",
			unetUpsampleLayer_strides: "(2, 2)",
			unetUpsampleLayer_padding: "same",
			unetUpsampleLayer_activation: "relu",
		},
	},
	attention: {
		name: "Attention Layer",
		description: "Self-attention mechanism for sequence models",
		category: "specialized",
		purposes: ["attention"],
		compatibleWith: ["nlp", "general"],
		config: {
			attentionLayer_numHeads: 8,
			attentionLayer_keyDim: 64,
			attentionLayer_valueDim: 64,
			attentionLayer_dropout: 0.1,
			attentionLayer_useCausalMask: false,
		},
	},
	transformer_encoder: {
		name: "Transformer Encoder",
		description: "Encoder block from transformer architecture",
		category: "specialized",
		purposes: ["attention", "sequence"],
		compatibleWith: ["nlp", "general"],
		config: {
			transformerEncoderLayer_numHeads: 8,
			transformerEncoderLayer_dimFeedforward: 2048,
			transformerEncoderLayer_dropout: 0.1,
			transformerEncoderLayer_activation: "relu",
			transformerEncoderLayer_layerNorm: true,
		},
	},
};
