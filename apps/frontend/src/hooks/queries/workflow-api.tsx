import { workflowService } from "@/services/workflow";
import type { AppInfiniteQuery, AppQueryOptions } from "@/types/tanstack-type";
import { buildQueryParams } from "@/utils/build-param";
import {
	keepPreviousData,
	useInfiniteQuery,
	useQuery,
} from "@tanstack/react-query";
import type { QueryParams } from "../use-query-params";

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
		queryFn: async () => await workflowService.getWorkflows(),
		queryKey: ["workflows"],
		...options,
	});
};

export const useGetInfWorkflows = ({
	params,
	config: { enabled } = {},
}: {
	params?: QueryParams;
	config?: { enabled?: any };
} = {}): AppInfiniteQuery<typeof workflowService.getWorkflows> =>
	useInfiniteQuery({
		queryKey: ["workflows", params],
		initialPageParam: buildQueryParams(params),
		queryFn: async ({ pageParam = null }) =>
			await workflowService.getWorkflows({ pageParam }),
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
