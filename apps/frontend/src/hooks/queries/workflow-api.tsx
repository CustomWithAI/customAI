import { workflowService } from "@/services/workflow";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkflowById = (
	id: string,
	options?: AppQueryOptions<typeof workflowService.getWorkflowById>,
) => {
	return useQuery({
		queryFn: async () => workflowService.getWorkflowById(id),
		queryKey: ["workflow", id],
		...options,
	});
};

export const useGetWorkflows = (
	options?: AppQueryOptions<typeof workflowService.getWorkflows>,
) => {
	return useQuery({
		queryFn: workflowService.getWorkflows,
		queryKey: ["workflows"],
		...options,
	});
};
