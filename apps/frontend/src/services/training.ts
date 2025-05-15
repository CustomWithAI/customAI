import { axiosClient } from "@/libs/api-client";
import type { ResponsePagination } from "@/types/common";
import type { TrainingPipeline } from "@/types/request/requestTrainingPreset";
import type {
	ChangeableTrainingModel,
	TrainingModel,
	TrainingQueue,
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
	clone: async ({
		workflowId,
		trainingId,
	}: { workflowId: string; trainingId: string }) => {
		try {
			return axiosClient.post<TrainingModel>(
				`/workflows/${workflowId}/trainings/${trainingId}/clone`,
			);
		} catch (error) {}
	},
	setDefault: async ({
		workflowId,
		trainingId,
	}: { workflowId: string; trainingId: string }) => {
		try {
			return axiosClient.post<TrainingModel>(
				`/workflows/${workflowId}/trainings/${trainingId}/set-default`,
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
	getDataTrainingById: async ({
		workflowId,
		trainingId,
	}: { workflowId: string; trainingId: string }) => {
		try {
			const response = await axiosClient.get<TrainingModel>(
				`/workflows/${workflowId}/trainings/${trainingId}`,
			);
			return response?.data;
		} catch (error) {}
	},
	deleteTrainingById: async ({
		workflowId,
		trainingId,
	}: { workflowId: string; trainingId: string }) => {
		try {
			return axiosClient.delete<TrainingModel>(
				`/workflows/${workflowId}/trainings/${trainingId}`,
			);
		} catch (error) {}
	},
	getTrainingByWorkflowId: async ({
		workflowId,
		params,
	}: { workflowId: string; params: string }) => {
		try {
			const response = await axiosClient.get<ResponsePagination<TrainingModel>>(
				`/workflows/${workflowId}/trainings${params}`,
			);
			return response?.data;
		} catch (error) {}
	},
	getTrainingByDefault: async ({ workflowId }: { workflowId: string }) => {
		try {
			return axiosClient.get<TrainingModel>(
				`/workflows/${workflowId}/trainings/default`,
			);
		} catch (error) {}
	},
	startTraining: async ({
		workflowId,
		trainingId,
	}: { workflowId?: string; trainingId?: string }) => {
		try {
			return axiosClient.post<TrainingQueue>(
				`workflows/${workflowId}/trainings/${trainingId}/start`,
			);
		} catch (error) {}
	},
};
