import type { Pipeline } from "../request/requestTrainingPreset";
import type { AugmentationModel } from "./augmentation";
import type { DebugType } from "./common";
import type { ResponseCustomModel } from "./customModel";
import type { ResponseDataset } from "./dataset";
import type { FeatureExModel } from "./feature-ex";
import type { PreprocessingModel } from "./preprocessing";
import type { WorkflowModel } from "./workflow";

export type TrainingModel = DebugType<
	{
		id: string;
		isDefault: boolean;
		status: string;
		queueId: string;
		dataset: ResponseDataset;
		augmentation: AugmentationModel;
		imagePreprocessing: PreprocessingModel;
		featureExtraction: FeatureExModel;
		retryCount: number;
		errorMessage: string;
		trainedModelPath: string;
		workflowId: string;
		createdAt: string;
		updatedAt: string;
		customModel: ResponseCustomModel;
		workflow: WorkflowModel;
	} & Pick<
		Required<ChangeableTrainingModel>,
		| "pipeline"
		| "version"
		| "preTrainedModel"
		| "machineLearningModel"
		| "hyperparameter"
	>
>;

export type TrainingQueue = {
	message: string;
	queueId: string;
};
export type ChangeableTrainingModel = Partial<{
	pipeline: Pipeline;
	version: string;
	datasetId: string;
	imagePreprocessingId: string;
	featureExtractionId: string;
	hyperparameter: Record<string, any>;
	featureSelectionId: string;
	augmentationId: string;
	preTrainedModel: string | null;
	machineLearningModel: {
		type?: string;
		model?: Record<string, any>;
	} | null;
	customModelId: string | null;
}>;
