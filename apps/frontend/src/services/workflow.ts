import { axiosClient } from "@/libs/api-client";
import type { WorkflowDetails } from "@/models/workflow";
import type { ResponseDataset, ResponseImage } from "@/types/response/dataset";
import type { WorkflowModel } from "@/types/response/workflow";
import type { responsePagination } from "../types/common";

export const workflowService = {
	createWorkflow: async (data: WorkflowDetails) => {
		try {
			return axiosClient.post<WorkflowModel>("/workflows", data);
		} catch (error) {}
	},
	getWorkflowById: async (id: string) => {
		try {
			return axiosClient.get<WorkflowModel>(`/workflows/${id}`);
		} catch (error) {}
	},
};
