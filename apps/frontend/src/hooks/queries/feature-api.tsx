import { augmentationService } from "@/services/augmentation";
import { featureExService } from "@/services/feature-ex";
import type { AppInfiniteQuery } from "@/types/tanstack-type";
import { buildQueryParams } from "@/utils/build-param";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { QueryParams } from "../use-query-params";

export const useGetInfFeatureEx = ({
	params,
	config: { enabled } = {},
}: {
	params?: QueryParams;
	config?: { enabled?: any };
} = {}): AppInfiniteQuery<typeof featureExService.getFeatureEx> =>
	useInfiniteQuery({
		queryKey: ["featureEx", params],
		initialPageParam: buildQueryParams(params),
		queryFn: async ({ pageParam = null }) =>
			await featureExService.getFeatureEx({ pageParam }),
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
