import { customModelService } from "@/services/customModel";
import type { AppInfiniteQuery } from "@/types/tanstack-type";
import { buildQueryParams } from "@/utils/build-param";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { QueryParams } from "../use-query-params";

export const useGetInfCustomModel = ({
	params,
	config: { enabled } = {},
}: {
	params?: QueryParams;
	config?: { enabled?: any };
} = {}): AppInfiniteQuery<typeof customModelService.getCustomModel> =>
	useInfiniteQuery({
		queryKey: ["inf-custom-models", params],
		initialPageParam: buildQueryParams(params),
		queryFn: async ({ pageParam = null }) =>
			await customModelService.getCustomModel({ pageParam }),
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
