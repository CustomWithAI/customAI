import { datasetService } from "@/services/dataset";
import type { AppQueryOptions } from "@/types/tanstack-type";
import { useQuery } from "@tanstack/react-query";

export const useGetDatasets = (
	options?: AppQueryOptions<typeof datasetService.getDatasets>,
) =>
	useQuery({
		queryKey: ["datasets"],
		queryFn: async () => await datasetService.getDatasets(),
		...options,
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
