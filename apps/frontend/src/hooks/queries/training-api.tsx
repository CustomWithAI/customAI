import { trainingService } from "@/services/training";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "../use-query-params";

export const useGetTrainingById = (
	workflowId: string,
	trainingId: string,
	options?: AppQueryOptions<typeof trainingService.getTrainingById>,
) => {
	return useQuery({
		queryFn: async () =>
			trainingService.getTrainingById({ workflowId, trainingId }),
		queryKey: ["training", workflowId, trainingId],
		...options,
	});
};

export const useGetTrainingByWorkflowId = (
	workflowId: string,
	params = "",
	options?: AppQueryOptions<typeof trainingService.getTrainingByWorkflowId>,
) =>
	useQuery({
		queryFn: async () =>
			trainingService.getTrainingByWorkflowId({ workflowId, params }),
		queryKey: ["training", workflowId],
		...options,
	});

export const useGetTrainingByDefault = (
	workflowId: string,
	options?: AppQueryOptions<typeof trainingService.getTrainingByDefault>,
) => {
	return useQuery({
		queryKey: ["training", workflowId, "default"],
		queryFn: async () => trainingService.getTrainingByDefault({ workflowId }),
		...options,
	});
};
