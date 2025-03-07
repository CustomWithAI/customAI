import type { Pipeline } from "../request/requestTrainingPreset";
import type { DebugType } from "./common";
import type { ResponseDataset } from "./dataset";
import type { PreprocessingModel } from "./preprocessing";
import type { WorkflowModel } from "./workflow";

export type TrainingModel = DebugType<
	{
		id: string;
		isDefault: boolean;
		status: string;
		queueId: string;
		dataset: ResponseDataset;
		imagePreprocessing: PreprocessingModel;
		retryCount: number;
		errorMessage: string;
		trainedModelPath: string;
		workflowId: string;
		createdAt: string;
		updatedAt: string;
		workflow: WorkflowModel;
	} & Pick<
		Required<ChangeableTrainingModel>,
		"pipeline" | "version" | "preTrainedModel"
	>
>;

export type ChangeableTrainingModel = Partial<{
	hyperparameter: object;
	pipeline: Pipeline;
	version: number;
	datasetId: string;
	imagePreprocessingId: string;
	featureExtractionId: string;
	featureSelectionId: string;
	augmentationId: string;
	preTrainedModel: object;
	customModelId: string;
}>;
