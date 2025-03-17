import { datasetService } from "@/services/dataset";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteImageByPath = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: datasetService.deleteImage,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["datasets"] });
		},
	});
};

export const useUpdateImage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: datasetService.updateImage,
		onSuccess: (_, params) => {
			queryClient.invalidateQueries({
				queryKey: ["surroundingImages", params.id, params.imagesPath],
			});
			queryClient.invalidateQueries({
				queryKey: ["datasets", "images", params.id],
			});
		},
	});
};

export const useCreateDataset = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: datasetService.createDataset,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["datasets"] });
		},
	});
};

export const useUpdateDataset = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: datasetService.updateDataset,
		onSuccess: (ctx) => {
			queryClient.invalidateQueries({ queryKey: ["datasets"] });
			queryClient.invalidateQueries({ queryKey: ["dataset", ctx?.id] });
		},
	});
};
