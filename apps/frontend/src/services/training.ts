import { axiosClient } from "@/libs/api-client";
import type { TrainingPipeline } from "@/types/request/requestTrainingPreset";
import type {
	ChangeableTrainingModel,
	TrainingModel,
} from "@/types/response/training";
import type { AxiosError } from "axios";

export const trainingService = {
	createTraining: async ({
		workflowId,
		...trainingPipeline
	}: TrainingPipeline & { workflowId: string }) => {
		try {
			return axiosClient.post<TrainingModel>(
				`/workflows/${workflowId}/trainings`,
				trainingPipeline,
			);
		} catch (error) {}
	},
	updateTraining: async ({
		workflowId,
		trainingId,
		...trainingData
	}: ChangeableTrainingModel & { workflowId: string; trainingId: string }) => {
		try {
			return axiosClient.put<TrainingModel>(
				`/workflows/${workflowId}/trainings/${trainingId}`,
				trainingData,
			);
		} catch (error) {}
	},
	getTrainingById: async ({
		workflowId,
		trainingId,
	}: { workflowId: string; trainingId: string }) => {
		try {
			return axiosClient.get<TrainingModel>(
				`/workflows/${workflowId}/trainings/${trainingId}`,
			);
		} catch (error) {}
	},
};
