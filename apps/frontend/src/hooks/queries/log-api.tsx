import { logService } from "@/services/log";
import type { AppInfiniteQuery } from "@/types/tanstack-type";
import { buildQueryParams } from "@/utils/build-param";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { QueryParams } from "../use-query-params";

export const useGetLogs = ({
	id,
	trainingId,
	params,
	config: { enabled } = {},
}: {
	id?: string;
	trainingId?: string;
	params?: QueryParams;
	config?: { enabled?: any };
} = {}): AppInfiniteQuery<typeof logService.getLogs> =>
	useInfiniteQuery({
		queryKey: ["inf-log", params],
		initialPageParam: buildQueryParams(params),
		queryFn: async ({ pageParam = null }) =>
			await logService.getLogs({ id, trainingId, pageParam }),
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
