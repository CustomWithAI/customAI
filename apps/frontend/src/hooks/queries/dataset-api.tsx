import { datasetService } from "@/services/dataset";
import type { ResponsePagination } from "@/types/common";
import type { ResponseDataset } from "@/types/response/dataset";
import type {
	AppInfiniteOptions,
	AppInfiniteQueryOptions,
	AppQueryOptions,
} from "@/types/tanstack-type";
import { buildQueryParams } from "@/utils/build-param";
import {
	type InfiniteData,
	type UseInfiniteQueryResult,
	useInfiniteQuery,
	useQuery,
} from "@tanstack/react-query";

export const useGetDatasets = (
	options?: AppQueryOptions<typeof datasetService.getDatasets>,
) =>
	useQuery({
		queryKey: ["datasets"],
		queryFn: async () => await datasetService.getDatasets(),
		...options,
	});

export const useGetInfDatasets: () => UseInfiniteQueryResult<
	InfiniteData<ResponsePagination<ResponseDataset> | undefined>,
	Error
> = () =>
	useInfiniteQuery({
		queryKey: ["datasets"],
		queryFn: async ({ pageParam }) =>
			await datasetService.getDatasets({ pageParam }),
		initialPageParam: "",
		getNextPageParam: (lastPage, page) => {
			return lastPage?.nextCursor
				? buildQueryParams({ cursor: lastPage.nextCursor })
				: null;
		},
		getPreviousPageParam: (firstPage, page) =>
			firstPage?.prevCursor
				? buildQueryParams({ cursor: firstPage.prevCursor })
				: null,
		select: (data) => {
			return {
				pages: data?.pages || [],
				pageParams: data?.pageParams || [],
			};
		},
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
