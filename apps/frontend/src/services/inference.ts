import { axiosClient } from "@/libs/api-client";
import type { ResponsePagination } from "@/types/common";
import type { InferenceResponse } from "@/types/response/inference";

export const inferenceService = {
	createCustomInference: async ({ data }: { data: FormData }) => {
		try {
			return axiosClient.post<InferenceResponse>("/model-inferences/", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
		} catch (error) {}
	},
	createWorkflowInference: async ({
		workflowId,
		data,
	}: { workflowId: string; data: FormData }) => {
		try {
			return axiosClient.post<InferenceResponse>(
				`/model-inferences/workflows/${workflowId}`,
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
		} catch (error) {}
	},
	createTrainingInference: async ({
		workflowId,
		trainingId,
		data,
	}: { workflowId: string; trainingId: string; data: FormData }) => {
		try {
			return axiosClient.post<InferenceResponse>(
				`/model-inferences/workflows/${workflowId}/trainings/${trainingId}/`,
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
		} catch (error) {}
	},
	getInferences: async (
		{ pageParam }: { pageParam: string | null } = { pageParam: null },
	) => {
		try {
			const response = await axiosClient.get<
				ResponsePagination<InferenceResponse>
			>(`/model-inferences${pageParam || ""}`);
			return response?.data;
		} catch (error) {}
	},
	getInference: async ({ id }: { id: string }) => {
		try {
			const response = await axiosClient.get<InferenceResponse>(
				`/model-inferences/${id || ""}`,
			);
			return response?.data;
		} catch (error) {}
	},
};
