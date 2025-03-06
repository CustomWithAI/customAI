import { trainingService } from "@/services/training";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useQuery } from "@tanstack/react-query";

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
