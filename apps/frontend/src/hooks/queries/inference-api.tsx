import { inferenceService } from "@/services/inference";
import type { AppMutationOptions } from "@/types/tanstack-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCustomInference = ({
	options,
}: {
	options?: AppMutationOptions<typeof inferenceService.createCustomInference>;
} = {}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: inferenceService.createCustomInference,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inferences"] });
		},
		...options,
	});
};

export const useCreateWorkflowInference = ({
	options,
}: {
	options?: AppMutationOptions<typeof inferenceService.createWorkflowInference>;
} = {}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: inferenceService.createWorkflowInference,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inferences"] });
		},
		...options,
	});
};

export const useCreateTrainingInference = ({
	options,
}: {
	options?: AppMutationOptions<typeof inferenceService.createTrainingInference>;
} = {}) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: inferenceService.createTrainingInference,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inferences"] });
		},
		...options,
	});
};
