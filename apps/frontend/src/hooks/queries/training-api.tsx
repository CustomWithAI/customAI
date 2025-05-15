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
import type { QueryParams } from "../use-query-params";

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

export const useGetDataTrainingById = (
	workflowId: string,
	trainingId: string,
	options?: AppQueryOptions<typeof trainingService.getDataTrainingById>,
) => {
	return useQuery({
		queryFn: async () =>
			trainingService.getDataTrainingById({ workflowId, trainingId }),
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

export const useGetInfTrainingByWorkflowId = ({
	workflowId,
	params,
	config: { enabled } = {},
}: {
	workflowId: string;
	params?: QueryParams;
	config?: { enabled?: boolean };
}): AppInfiniteQuery<typeof trainingService.getTrainingByWorkflowId> =>
	useInfiniteQuery({
		queryKey: ["inf-training", workflowId],
		queryFn: async ({ pageParam = "" }) =>
			await trainingService.getTrainingByWorkflowId({
				workflowId,
				params: pageParam || "",
			}),
		initialPageParam: buildQueryParams(params),
		getNextPageParam: (lastPage) =>
			lastPage?.nextCursor
				? buildQueryParams({ cursor: lastPage.nextCursor, ...params })
				: null,
		getPreviousPageParam: (firstPage) =>
			firstPage?.prevCursor
				? buildQueryParams({ cursor: firstPage.prevCursor, ...params })
				: null,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		enabled,
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
