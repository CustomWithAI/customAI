export const modelKeyword: Record<
	string,
	{ type: string; description: string; typeClass: string }
> = {
	resnet50: {
		type: "balanced",
		description:
			"A deep residual network offering a trade-off between speed and accuracy.",
		typeClass: "text-blue-500 bg-blue-300",
	},
	vgg16: {
		type: "heavy",
		description:
			"A deep convolutional network with high accuracy but large model size.",
		typeClass: "text-amber-500 bg-amber-300",
	},
	mobilenetv2: {
		type: "light",
		description:
			"A highly efficient network optimized for mobile and edge devices.",
		typeClass: "text-green-500 bg-green-300",
	},
	yolov5: {
		type: "fast",
		description:
			"An efficient real-time object detection model with good speed and accuracy.",
		typeClass: "text-indigo-500 bg-indigo-300",
	},
	yolov8: {
		type: "faster",
		description: "An optimized YOLO version with better speed and accuracy.",
		typeClass: "text-lime-500 bg-lime-300",
	},
	yolov11: {
		type: "accuracy",
		description:
			"A more advanced YOLO version, prioritizing precision over speed.",
		typeClass: "text-purple-500 bg-purple-300",
	},
};
