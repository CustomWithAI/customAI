import { axiosClient } from "@/libs/api-client";
import type { WorkflowDetails } from "@/models/workflow";
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
	getWorkflows: async () => {
		try {
			return axiosClient.get<responsePagination<WorkflowModel>>("/workflows");
		} catch (error) {}
	},
	updateWorkflow: async ({
		id,
		workflow,
	}: { id: string; workflow: Partial<WorkflowDetails> }) => {
		try {
			return axiosClient.put<WorkflowModel>(`/workflows/${id}`, workflow);
		} catch (error) {}
	},
};
