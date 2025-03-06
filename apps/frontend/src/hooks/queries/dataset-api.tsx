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
		queryKey: ["datasets", "images", id],
		queryFn: async () => await datasetService.getImages({ id, params }),
		...options,
	});
