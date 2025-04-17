import { workflowService } from "@/services/workflow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateWorkflow = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: workflowService.createWorkflow,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["workflows", data?.data.id] });
		},
	});
};

export const useUpdateWorkflow = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: workflowService.updateWorkflow,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["workflows", data?.data.id] });
		},
	});
};
