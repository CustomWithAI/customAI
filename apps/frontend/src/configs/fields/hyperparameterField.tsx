import type { FormFieldInput } from "@/components/builder/form";
import type {
	ClassificationSchema,
	ObjectDetectionSchema,
	SegmentationSchema,
} from "@/models/model-config";

export const ClassificationParams: FormFieldInput<ClassificationSchema> = [
	{
		template: "number",
		element: {
			label: "Learning Rate",
			description:
				"Determines the step size for model updates during training.",
			key: "learning_rate",
			testDataId: "learning_rate",
			name: "learning_rate",
			placeholder: "Eg., 0.01, 0.1, 1",
		},
		config: {},
	},
	{
		template: "number",
		element: {
			label: "Momentum",
			description:
				"Controls the influence of previous updates on the current step, improving stability.",
			key: "momentum",
			testDataId: "momentum",
			name: "momentum",
			placeholder: "Eg., 0.5, 0.9, 1",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Optimizer Type",
			description: "Algorithm used to adjust model parameters during training.",
			key: "optimizer_type",
			testDataId: "optimizer_type",
			name: "optimizer_type",
		},
		config: {
			options: {
				group: false,
				list: [
					{
						value: "adam",
						label: "Adam",
					},
					{
						value: "sgd",
						label: "Stochastic Gradient Descent (SGD)",
					},
				],
			},
		},
	},
	{
		template: "int",
		element: {
			label: "Epochs",
			description:
				"Number of times the model processes the entire dataset during training.",
			key: "epochs",
			testDataId: "epochs",
			name: "epochs",
			placeholder: "Eg., 10, 50, 100",
		},
		config: {},
	},
	{
		template: "int",
		element: {
			label: "Batch Size",
			description:
				"Number of samples processed before updating model weights. Larger values suit bigger datasets.",
			key: "batch_size",
			testDataId: "batch_size",
			name: "batch_size",
			placeholder: "Eg., 16, 32, 64",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Loss Function",
			description:
				"Measures how well the model's predictions match the actual labels.",
			key: "loss_function",
			testDataId: "loss_function",
			name: "loss_function",
		},
		config: {
			options: {
				group: false,
				list: [
					{
						value: "categorical_crossentropy",
						label: "Categorical Crossentropy",
					},
				],
			},
		},
	},
];

export const ObjectDetectionParams: FormFieldInput<ObjectDetectionSchema> = [
	{
		template: "int",
		element: {
			label: "Batch Size",
			description:
				"Number of samples processed before updating model weights. Larger values work well for larger datasets.",
			key: "batch_size",
			testDataId: "batch_size",
			name: "batch_size",
			placeholder: "E.g., 16, 32, 64",
		},
		config: {},
	},
	{
		template: "int",
		element: {
			label: "Epochs",
			description:
				"Number of times the model processes the entire dataset during training.",
			key: "epochs",
			testDataId: "epochs",
			name: "epochs",
			placeholder: "E.g., 10, 50, 100",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Weight File",
			description: "the pre-trained model weight file name (e.g., 'yolov5s').",
			key: "weight_size",
			testDataId: "weight_size",
			name: "weight_size",
			placeholder: "E.g., yolov5s",
		},
		config: {
			options: {
				group: true,
				list: {
					"object detection": [
						{ label: "yolov5s.pt", value: "yolov5s.pt" },
						{ label: "yolov5m.pt", value: "yolov5m.pt" },
						{ label: "yolov5l.pt", value: "yolov5l.pt" },
						{ label: "yolov8s.pt", value: "yolov8s.pt" },
						{ label: "yolov8m.pt", value: "yolov8m.pt" },
						{ label: "yolov8l.pt", value: "yolov8l.pt" },
						{ label: "yolo11s.pt", value: "yolo11s.pt" },
						{ label: "yolo11m.pt", value: "yolo11m.pt" },
						{ label: "yolo11l.pt", value: "yolo11l.pt" },
					],
				},
			},
		},
	},
];

export const SegmentationParams: FormFieldInput<SegmentationSchema> = [
	{
		template: "number",
		element: {
			label: "Batch Size",
			description:
				"Number of samples processed before updating model weights. Larger values work well for larger datasets.",
			key: "batch_size",
			testDataId: "batch_size",
			name: "batch_size",
			placeholder: "E.g., 16, 32, 64",
		},
		config: {},
	},
	{
		template: "number",
		element: {
			label: "Epochs",
			description:
				"Number of times the model processes the entire dataset during training.",
			key: "epochs",
			testDataId: "epochs",
			name: "epochs",
			placeholder: "E.g., 10, 50, 100",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Weight File",
			description: "the pre-trained model weight file name (e.g., 'yolov5s').",
			key: "weight_size",
			testDataId: "weight_size",
			name: "weight_size",
			placeholder: "E.g., yolov8s-seg.pt",
		},
		config: {
			options: {
				group: true,
				list: {
					segmentation: [
						{ label: "yolov8s-seg.pt", value: "yolov8s-seg.pt" },
						{ label: "yolov8m-seg.pt", value: "yolov8m-seg.pt" },
						{ label: "yolov8l-seg.pt", value: "yolov8l-seg.pt" },
						{ label: "yolo11s-seg.pt", value: "yolo11s-seg.pt" },
						{ label: "yolo11m-seg.pt", value: "yolo11m-seg.pt" },
						{ label: "yolo11l-seg.pt", value: "yolo11l-seg.pt" },
					],
				},
			},
		},
	},
];
