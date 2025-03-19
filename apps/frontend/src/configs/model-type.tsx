export const MODEL_TYPE: Record<
	string,
	{ type: string; description: string; typeClass: string }
> = {
	decision_trees: {
		type: "small datasets",
		description:
			"A tree-based model that splits data recursively based on feature importance.",
		typeClass: "text-green-600 bg-green-100",
	},
	random_forest: {
		type: "accurate",
		description:
			"An ensemble learning method that combines multiple decision trees for improved accuracy.",
		typeClass: "text-yellow-600 bg-yellow-100",
	},
	svm: {
		type: "effective",
		description:
			"A support vector machine that finds the optimal hyperplane for classification tasks.",
		typeClass: "text-purple-600 bg-purple-100",
	},
	knn: {
		type: "pattern recognition",
		description:
			"A k-nearest neighbors algorithm that classifies based on the majority vote of neighbors.",
		typeClass: "text-red-600 bg-red-100",
	},
};
