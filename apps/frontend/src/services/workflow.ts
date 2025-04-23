import { axiosClient } from "@/libs/api-client";
import type { WorkflowDetails } from "@/models/workflow";
import type { WorkflowModel } from "@/types/response/workflow";
import type { ResponsePagination } from "../types/common";

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
	getWorkflows: async (
		{ pageParam }: { pageParam: string | null } = { pageParam: null },
	) => {
		try {
			const response = await axiosClient.get<ResponsePagination<WorkflowModel>>(
				`/workflows${pageParam || ""}`,
			);
			return response?.data;
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
