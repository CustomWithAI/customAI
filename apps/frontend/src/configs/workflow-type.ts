export enum workflowEnum {
	ObjectDetection = "object_detection",
	Classification = "classification",
	Segmentation = "segmentation",
}

export const workflowTypeConfig: Record<
	string,
	{ name: string; description: string; tags: string[] }
> = {
	[workflowEnum.ObjectDetection]: {
		name: "Object Detection",
		description: "Localize and classify objects in images.",
		tags: ["Counting", "Locate", "Identify"],
	},
	[workflowEnum.Classification]: {
		name: "Image Classification",
		description: "Assign labels to images based on their content.",
		tags: ["Categorize", "Labeling", "Predict"],
	},
	[workflowEnum.Segmentation]: {
		name: "Image Segmentation",
		description: "Partition an image into multiple meaningful regions.",
		tags: ["Pixel-wise", "Region-based", "Masking"],
	},
};
