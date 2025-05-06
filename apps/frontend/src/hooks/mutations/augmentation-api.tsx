import { augmentationService } from "@/services/augmentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAugmentation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: augmentationService.createAugmentation,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["augmentation", data?.data.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["inf-augmentation"],
			});
		},
	});
};

export const useUpdateAugmentation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: augmentationService.updateAugmentation,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["augmentation", data?.data.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["inf-augmentation"],
			});
		},
	});
};
