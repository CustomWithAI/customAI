import type { FormFieldInput } from "@/components/builder/form";
import type {
	DecisionTreeSchema,
	KNNSchema,
	RandomForestSchema,
	SVMSchema,
} from "@/models/ml-config";

export const DecisionTreeParams: FormFieldInput<DecisionTreeSchema> = [
	{
		template: "number",
		element: {
			label: "Max Depth",
			description:
				"The maximum depth of the tree. Controls how deep the decision tree grows.",
			key: "max_depth_1",
			testDataId: "max_depth",
			name: "max_depth",
			placeholder: "Eg., 1, 2, 3",
		},
		config: {},
	},
	{
		template: "number",
		element: {
			label: "Min Samples Split",
			description:
				"The minimum number of samples required to split an internal node. A higher value prevents overfitting.",
			key: "min_samples_split_1",
			testDataId: "min_samples_split",
			name: "min_samples_split",
			placeholder: "Eg., 1, 2, 3",
		},
		config: {},
	},
	{
		template: "number",
		element: {
			label: "Min Samples Leaf",
			description:
				"The minimum number of samples required to be at a leaf node. A higher value prevents small, fragmented leaves.",
			key: "min_samples_leaf_1",
			testDataId: "min_samples_leaf",
			name: "min_samples_leaf",
			placeholder: "Eg., 1, 2, 3",
		},
		config: {},
	},
	{
		template: "text",
		element: {
			label: "Max Features",
			description: "The number of features to consider for each split.",
			key: "max_features_1",
			testDataId: "max_features",
			name: "max_features",
			placeholder: "'auto', 'sqrt', 'log2', a number",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Criterions",
			description: "The function used to measure the quality of a split.",
			key: "criterions_1",
			testDataId: "criterion",
			name: "criterion",
			placeholder: "'auto', 'sqrt', 'log2', a number",
		},
		config: {
			options: {
				group: false,
				list: [
					{ label: "Gini", value: "gini" },
					{ label: "Entropy", value: "entropy" },
					{ label: "Log Loss", value: "log_loss" },
				],
			},
		},
	},
];

export const RandomForestParams: FormFieldInput<RandomForestSchema> = [
	{
		template: "number",
		element: {
			label: "Number of Estimators",
			description:
				"The number of trees in the ensemble. More trees can improve accuracy but increase computation time.",
			key: "n_estimators_1",
			testDataId: "n_estimators",
			name: "n_estimators",
			placeholder: "Eg., 50, 100, 200",
		},
		config: {},
	},
	{
		template: "number",
		element: {
			label: "Max Depth",
			description:
				"The maximum depth of the tree. Controls how deep the decision tree grows.",
			key: "max_depth_1",
			testDataId: "max_depth",
			name: "max_depth",
			placeholder: "Eg., 1, 2, 3",
		},
		config: {},
	},
	{
		template: "number",
		element: {
			label: "Min Samples Split",
			description:
				"The minimum number of samples required to split an internal node. A higher value prevents overfitting.",
			key: "min_samples_split_1",
			testDataId: "min_samples_split",
			name: "min_samples_split",
			placeholder: "Eg., 1, 2, 3",
		},
		config: {},
	},
	{
		template: "number",
		element: {
			label: "Min Samples Leaf",
			description:
				"The minimum number of samples required to be at a leaf node. A higher value prevents small, fragmented leaves.",
			key: "min_samples_leaf_1",
			testDataId: "min_samples_leaf",
			name: "min_samples_leaf",
			placeholder: "Eg., 1, 2, 3",
		},
		config: {},
	},
	{
		template: "text",
		element: {
			label: "Max Features",
			description: "The number of features to consider for each split.",
			key: "max_features_1",
			testDataId: "max_features",
			name: "max_features",
			placeholder: "'auto', 'sqrt', 'log2', a number",
		},
		config: {},
	},
];

export const SVMParams: FormFieldInput<SVMSchema> = [
	{
		template: "select",
		element: {
			label: "Kernel",
			description: "Specifies the kernel type to be used in the algorithm.",
			key: "kernel_1",
			testDataId: "kernel",
			name: "kernel",
			placeholder: "Select kernel type",
		},
		config: {
			options: {
				group: false,
				list: [
					{ label: "Linear", value: "linear" },
					{ label: "Polynomial", value: "poly" },
					{ label: "Radial Basis Function (RBF)", value: "rbf" },
					{ label: "Sigmoid", value: "sigmoid" },
					{ label: "Precomputed", value: "precomputed" },
				],
			},
		},
	},
	{
		template: "select",
		element: {
			label: "Gamma",
			description:
				"Kernel coefficient. Determines how far the influence of a single training example reaches.",
			key: "gamma_1",
			testDataId: "gamma",
			name: "gamma",
			placeholder: "Select gamma value",
		},
		config: {
			options: {
				group: false,
				list: [
					{ label: "Scale", value: "scale" },
					{ label: "Auto", value: "auto" },
				],
			},
		},
	},
	{
		template: "number",
		element: {
			label: "Degree",
			description:
				"Degree of the polynomial kernel function (‘poly’). Ignored by other kernels.",
			key: "degree_1",
			testDataId: "degree",
			name: "degree",
			placeholder: "Eg., 2, 3, 4",
		},
		config: {},
	},
];

export const KNNParams: FormFieldInput<KNNSchema> = [
	{
		template: "number",
		element: {
			label: "Number of Neighbors",
			description: "The number of neighbors to use for kneighbors queries.",
			key: "n_neighbors_1",
			testDataId: "n_neighbors",
			name: "n_neighbors",
			placeholder: "Eg., 3, 5, 10",
		},
		config: {},
	},
	{
		template: "select",
		element: {
			label: "Weights",
			description: "Weight function used in prediction.",
			key: "weights_1",
			testDataId: "weights",
			name: "weights",
			placeholder: "Select weight type",
		},
		config: {
			options: {
				group: false,
				list: [
					{ label: "Uniform", value: "uniform" },
					{ label: "Distance", value: "distance" },
				],
			},
		},
	},
	{
		template: "select",
		element: {
			label: "Algorithm",
			description: "Algorithm used to compute the nearest neighbors.",
			key: "algorithm_1",
			testDataId: "algorithm",
			name: "algorithm",
			placeholder: "Select algorithm type",
		},
		config: {
			options: {
				group: false,
				list: [
					{ label: "Auto", value: "auto" },
					{ label: "Ball Tree", value: "ball_tree" },
					{ label: "KD Tree", value: "kd_tree" },
					{ label: "Brute", value: "brute" },
				],
			},
		},
	},
	{
		template: "number",
		element: {
			label: "Leaf Size",
			description: "Leaf size passed to BallTree or KDTree.",
			key: "leaf_size_1",
			testDataId: "leaf_size",
			name: "leaf_size",
			placeholder: "Eg., 10, 30, 50",
		},
		config: {},
	},
];
