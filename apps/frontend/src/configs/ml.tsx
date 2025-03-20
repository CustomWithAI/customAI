import type { FormFieldInput } from "@/components/builder/form";
import {
	decisionTreeSchema,
	knnSchema,
	randomForestSchema,
	svmSchema,
} from "@/models/ml-config";
import type { ZodObject } from "zod";
import {
	DecisionTreeParams,
	KNNParams,
	RandomForestParams,
	SVMParams,
} from "./mlField";

export enum MLType {
	DecisionTree = "decision_trees",
	RandomForest = "random_forest",
	SVM = "svm",
	KNN = "knn",
}

export const machineLearningByType: Record<
	string,
	{ formField: FormFieldInput<any>; schema: ZodObject<any> }
> = {
	[MLType.DecisionTree]: {
		formField: DecisionTreeParams,
		schema: decisionTreeSchema,
	},
	[MLType.RandomForest]: {
		formField: RandomForestParams,
		schema: randomForestSchema,
	},
	[MLType.SVM]: {
		formField: SVMParams,
		schema: svmSchema,
	},
	[MLType.KNN]: {
		formField: KNNParams,
		schema: knnSchema,
	},
};
