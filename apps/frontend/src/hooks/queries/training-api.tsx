import { trainingService } from "@/services/training";
import type { ResponsePagination } from "@/types/common";
import type { ResponseDataset } from "@/types/response/dataset";
import type { AppInfiniteQuery, AppQueryOptions } from "@/types/tanstack-type";
import { buildQueryParams } from "@/utils/build-param";
import {
	type InfiniteData,
	type UseInfiniteQueryResult,
	keepPreviousData,
	useInfiniteQuery,
	useQuery,
} from "@tanstack/react-query";
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
	params: string | null = "",
	options?: AppQueryOptions<typeof trainingService.getTrainingByWorkflowId>,
) =>
	useQuery({
		queryFn: async () =>
			trainingService.getTrainingByWorkflowId({
				workflowId,
				params: params || "",
			}),
		queryKey: ["training", workflowId],
		...options,
	});

export const useGetInfTrainingByWorkflowId = (
	workflowId: string,
): AppInfiniteQuery<typeof trainingService.getTrainingByWorkflowId> =>
	useInfiniteQuery({
		queryKey: ["training", workflowId],
		queryFn: async ({ pageParam = "" }) =>
			await trainingService.getTrainingByWorkflowId({
				workflowId,
				params: pageParam || "",
			}),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) =>
			lastPage?.nextCursor
				? buildQueryParams({ cursor: lastPage.nextCursor })
				: null,
		getPreviousPageParam: (firstPage) =>
			firstPage?.prevCursor
				? buildQueryParams({ cursor: firstPage.prevCursor })
				: null,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
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
