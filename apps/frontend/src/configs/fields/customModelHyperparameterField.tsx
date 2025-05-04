import type { FormFieldInput } from "@/components/builder/form";
import type {
	ClassificationSchema,
	ObjectDetectionSchema,
	SegmentationSchema,
} from "@/models/customModel-config";

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
	{
		template: "checkbox",
		element: {
			label: "Reduce LR on Plateau",
			description:
				"Enable learning rate reduction when monitored metric has stopped improving.",
			key: "reduce_lr_on_plateau",
			testDataId: "reduce_lr_on_plateau",
			name: "reduce_lr_on_plateau",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Plateau Monitor",
			description:
				"Metric to monitor for learning rate reduction (e.g., 'val_loss').",
			key: "plateau_monitor",
			testDataId: "plateau_monitor",
			name: "callbacks.reduce_lr_on_plateau.monitor",
			placeholder: "Eg., val_loss",
		},
		config: {
			conditionalField: "reduce_lr_on_plateau",
			options: {
				group: false,
				list: [
					{ label: "Validation Loss", value: "val_loss" },
					{ label: "Training Loss", value: "loss" },
					{ label: "Validation Accuracy", value: "val_accuracy" },
					{ label: "Training Accuracy", value: "accuracy" },
					{
						label: "Validation Mean Squared Error",
						value: "val_mean_squared_error",
					},
					{ label: "Mean Absolute Error", value: "mean_absolute_error" },
					{
						label: "Validation Mean Absolute Error",
						value: "val_mean_absolute_error",
					},
				],
			},
		},
	},
	{
		template: "number",
		element: {
			label: "Plateau Factor",
			description:
				"Factor by which the learning rate will be reduced (e.g., 0.1).",
			key: "plateau_factor",
			testDataId: "plateau_factor",
			name: "callbacks.reduce_lr_on_plateau.factor",
			placeholder: "Eg., 0.1",
		},
		config: {
			conditionalField: "reduce_lr_on_plateau",
		},
	},
	{
		template: "int",
		element: {
			label: "Plateau Patience",
			description:
				"Number of epochs with no improvement after which learning rate will be reduced.",
			key: "plateau_patience",
			testDataId: "plateau_patience",
			name: "callbacks.reduce_lr_on_plateau.patience",
			placeholder: "Eg., 10",
		},
		config: {
			conditionalField: "reduce_lr_on_plateau",
		},
	},
	{
		template: "number",
		element: {
			label: "Plateau Minimum LR",
			description: "Lower bound on the learning rate after reduction.",
			key: "plateau_min_lr",
			testDataId: "plateau_min_lr",
			name: "callbacks.reduce_lr_on_plateau.min_lr",
			placeholder: "Eg., 1e-6",
		},
		config: {
			conditionalField: "reduce_lr_on_plateau",
			conditionalValue: true,
		},
	},
	{
		template: "checkbox",
		element: {
			label: "Early Stopping",
			description:
				"Enable stopping training when monitored metric stops improving.",
			key: "early_stopping",
			testDataId: "early_stopping",
			name: "early_stopping",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Early Stopping Monitor",
			description: "Metric to monitor for early stopping (e.g., 'val_loss').",
			key: "early_stopping_monitor",
			testDataId: "early_stopping_monitor",
			name: "callbacks.early_stopping.monitor",
			placeholder: "Eg., val_loss",
		},
		config: {
			conditionalField: "early_stopping",
			conditionalValue: true,
			options: {
				group: false,
				list: [
					{ label: "Validation Loss", value: "val_loss" },
					{ label: "Training Loss", value: "loss" },
					{ label: "Validation Accuracy", value: "val_accuracy" },
					{ label: "Training Accuracy", value: "accuracy" },
					{
						label: "Validation Mean Squared Error",
						value: "val_mean_squared_error",
					},
					{ label: "Mean Absolute Error", value: "mean_absolute_error" },
					{
						label: "Validation Mean Absolute Error",
						value: "val_mean_absolute_error",
					},
				],
			},
		},
	},
	{
		template: "number",
		element: {
			label: "Early Stopping Patience",
			description:
				"Number of epochs with no improvement before training is stopped.",
			key: "early_stopping_patience",
			testDataId: "early_stopping_patience",
			name: "callbacks.early_stopping.patience",
			placeholder: "Eg., 5",
		},
		config: {
			conditionalField: "early_stopping",
			conditionalValue: true,
		},
	},
];

export const ObjectDetectionParams: FormFieldInput<ObjectDetectionSchema> = [
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
		template: "text",
		element: {
			label: "Weight File",
			description: "the pre-trained model weight file name (e.g., 'yolov5s').",
			key: "weight_size",
			testDataId: "weight_size",
			name: "weight_size",
			placeholder: "E.g., yolov5s",
		},
		config: {},
	},
];
