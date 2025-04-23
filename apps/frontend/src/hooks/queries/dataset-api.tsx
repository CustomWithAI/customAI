import { datasetService } from "@/services/dataset";
import type { ResponsePagination } from "@/types/common";
import type { ResponseDataset, ResponseImage } from "@/types/response/dataset";
import type {
	AppInfiniteOptions,
	AppInfiniteQuery,
	AppInfiniteQueryOptions,
	AppQueryOptions,
} from "@/types/tanstack-type";
import { buildQueryParams } from "@/utils/build-param";
import {
	type InfiniteData,
	type UseInfiniteQueryResult,
	keepPreviousData,
	useInfiniteQuery,
	useQuery,
} from "@tanstack/react-query";
import type { QueryParams } from "../use-query-params";

export const useGetDatasets = (
	options?: AppQueryOptions<typeof datasetService.getDatasets>,
) =>
	useQuery({
		queryKey: ["datasets"],
		queryFn: async () => await datasetService.getDatasets(),
		...options,
	});

export const useGetInfDatasets = ({
	params,
	config: { enabled } = {},
}: {
	params?: QueryParams;
	config?: { enabled?: any };
} = {}): AppInfiniteQuery<typeof datasetService.getDatasets> =>
	useInfiniteQuery({
		queryKey: ["datasets", params],
		initialPageParam: buildQueryParams(params),
		queryFn: async ({ pageParam = null }) =>
			await datasetService.getDatasets({ pageParam }),
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

export const useGetImages = (
	id: string,
	options?: AppQueryOptions<typeof datasetService.getImages>,
	params?: string,
) =>
	useQuery({
		queryKey: ["datasets", "images", id, params],
		queryFn: async () => await datasetService.getImages({ id, params }),
		...options,
	});

export const useGetInfImages = ({
	id,
}: { id: string }): UseInfiniteQueryResult<
	InfiniteData<ResponsePagination<ResponseImage> | undefined>,
	Error
> =>
	useInfiniteQuery({
		queryKey: ["datasets", "images", id],
		initialPageParam: null as string | null,
		queryFn: async ({ pageParam = null }) =>
			await datasetService.getImages({ id, params: pageParam || "" }),
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

export const useGetSurroundingImages = (
	id: string,
	pathId: string,
	options?: AppQueryOptions<typeof datasetService.getSurroundImageById>,
) =>
	useQuery({
		queryKey: ["surroundingImages", id, pathId],
		queryFn: async () =>
			await datasetService.getSurroundImageById({ id, pathId }),
		...options,
	});

export const useGetDataset = (
	id: string,
	options?: AppQueryOptions<typeof datasetService.getDataset>,
) =>
	useQuery({
		queryKey: ["dataset", id],
		queryFn: async () => await datasetService.getDataset({ id }),
		...options,
	});
