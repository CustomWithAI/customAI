import authService from "@/services/auth";
import { workflowService } from "@/services/workflow";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateWorkflow = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: workflowService.createWorkflow,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["workflows"] });
		},
	});
};
