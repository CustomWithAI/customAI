import { preprocessingService } from "@/services/preprocessing";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePreprocessing = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: preprocessingService.createPreprocessing,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["preprocessing", data?.data.id],
			});
		},
	});
};

export const useUpdatePreprocessing = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: preprocessingService.updatePreprocessing,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["preprocessing", data?.data.id],
			});
		},
	});
};
