import { datasetService } from "@/services/dataset";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteImageByPath = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: datasetService.deleteImage,
		onSuccess: (_, params) => {
			queryClient.invalidateQueries({ queryKey: ["datasets"] });
		},
	});
};
