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
