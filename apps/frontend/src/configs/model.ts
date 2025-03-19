export const MODEL_KEYWORD: Record<
	string,
	{ type: string; description: string; typeClass: string }
> = {
	resnet50: {
		type: "balanced",
		description:
			"A deep residual network offering a trade-off between speed and accuracy.",
		typeClass: "text-blue-600 bg-blue-100",
	},
	vgg16: {
		type: "heavy",
		description:
			"A deep convolutional network with high accuracy but large model size.",
		typeClass: "text-amber-600 bg-amber-100",
	},
	mobilenetv2: {
		type: "light",
		description:
			"A highly efficient network optimized for mobile and edge devices.",
		typeClass: "text-green-600 bg-green-100",
	},
	yolov5: {
		type: "fast",
		description:
			"An efficient real-time object detection model with good speed and accuracy.",
		typeClass: "text-indigo-600 bg-indigo-100",
	},
	yolov8: {
		type: "faster",
		description: "An optimized YOLO version with better speed and accuracy.",
		typeClass: "text-lime-600 bg-lime-100",
	},
	yolov11: {
		type: "accuracy",
		description:
			"A more advanced YOLO version, prioritizing precision over speed.",
		typeClass: "text-purple-600 bg-purple-100",
	},
};
